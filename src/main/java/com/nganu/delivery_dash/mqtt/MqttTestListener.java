package com.nganu.delivery_dash.mqtt;

import com.nganu.delivery_dash.service.TelemetryService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttCallbackExtended;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Connect ke broker, subscribe, dan simpan telemetry ke DB lewat TelemetryService.
 * Matikan dengan  mqtt.enabled=false  di application.properties.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MqttTestListener implements MqttCallbackExtended {

    @Value("${mqtt.enabled:true}")
    private boolean enabled;
    @Value("${mqtt.broker:tcp://broker.hivemq.com:1883}")
    private String broker;
    @Value("${mqtt.topic.data:itenas/d11/deliverydash/telemetry}")
    private String topicData;
    @Value("${mqtt.topic.status:itenas/d11/deliverydash/status}")
    private String topicStatus;

    private final TelemetryService telemetryService;
    // Tulis DB di thread sendiri: jangan memblok thread callback Paho. 1 thread -> urutan terjaga.
    private final ExecutorService dbWorker = Executors.newSingleThreadExecutor();
    private final AtomicLong savedCount = new AtomicLong();
    private volatile String lastResult = "none yet";

    private volatile MqttAsyncClient client;
    private volatile boolean stopping = false;

    private volatile String masterStatus = "unknown";
    private volatile String lastPayload = null;
    private volatile Instant lastMessageAt = null;
    private final AtomicLong messageCount = new AtomicLong();

    @PostConstruct
    public void start() {
        if (!enabled) {
            log.info("[mqtt] disabled (mqtt.enabled=false)");
            return;
        }
        // Thread terpisah: aplikasi tetap start walau broker tidak terjangkau
        Thread t = new Thread(this::connectLoop, "mqtt-connect");
        t.setDaemon(true);
        t.start();
    }

    // Paho hanya auto-reconnect SETELAH sekali berhasil connect, jadi percobaan awal di-retry manual
    private void connectLoop() {
        try {
            String clientId = "d11-backend-" + UUID.randomUUID().toString().substring(0, 8);
            client = new MqttAsyncClient(broker, clientId, new MemoryPersistence());
            client.setCallback(this);

            MqttConnectOptions opt = new MqttConnectOptions();
            opt.setCleanSession(true);
            opt.setAutomaticReconnect(true);
            opt.setConnectionTimeout(10);
            opt.setKeepAliveInterval(30);

            while (!stopping) {
                try {
                    log.info("[mqtt] connecting to {} as {}", broker, clientId);
                    client.connect(opt).waitForCompletion(15000);
                    return;   // subscribe dilakukan di connectComplete()
                } catch (MqttException e) {
                    log.warn("[mqtt] connect failed: {} (retry in 5s)", e.getMessage());
                    Thread.sleep(5000);
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (MqttException e) {
            log.error("[mqtt] cannot create client: {}", e.getMessage());
        }
    }

    @PreDestroy
    public void stop() {
        stopping = true;
        try {
            if (client != null) {
                if (client.isConnected()) client.disconnect().waitForCompletion(3000);
                client.close();
            }
        } catch (MqttException ignored) { }
        dbWorker.shutdown();
    }

    // Dipanggil saat connect pertama DAN tiap auto-reconnect. Subscribe async (tidak memblok thread callback).
    @Override
    public void connectComplete(boolean reconnect, String serverURI) {
        log.info("[mqtt] connected to {} (reconnect={})", serverURI, reconnect);
        try {
            client.subscribe(new String[]{topicData, topicStatus}, new int[]{0, 1});
        } catch (MqttException e) {
            log.error("[mqtt] subscribe failed: {}", e.getMessage());
        }
    }

    @Override
    public void connectionLost(Throwable cause) {
        log.warn("[mqtt] connection lost: {}", cause == null ? "?" : cause.getMessage());
    }

    @Override
    public void messageArrived(String topic, MqttMessage msg) {
        String text = new String(msg.getPayload(), StandardCharsets.UTF_8);
        if (topicStatus.equals(topic)) {
            masterStatus = text;
            log.info("[mqtt] master status = {}", text);
            return;
        }
        lastPayload = text;
        lastMessageAt = Instant.now();
        long n = messageCount.incrementAndGet();
        log.debug("[mqtt] #{} {} -> {}", n, topic, text);

        dbWorker.submit(() -> {
            String result = telemetryService.handlePayload(text);
            if ("saved".equals(result)) savedCount.incrementAndGet();
            if (!result.equals(lastResult)) {          // log hanya saat hasil berubah, bukan tiap detik
                log.info("[telemetry] {}", result);
                lastResult = result;
            }
        });
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) { }

    /** Untuk endpoint cek status. */
    public Map<String, Object> snapshot() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("enabled", enabled);
        m.put("broker", broker);
        m.put("mqttConnected", client != null && client.isConnected());
        m.put("masterStatus", masterStatus);          // online / offline / unknown
        m.put("messageCount", messageCount.get());
        m.put("lastMessageAt", lastMessageAt == null ? null : lastMessageAt.toString());
        m.put("lastPayload", lastPayload);
        m.put("savedToDb", savedCount.get());
        m.put("lastSaveResult", lastResult);       // saved / no active session / invalid: ... / error: ...
        return m;
    }
}