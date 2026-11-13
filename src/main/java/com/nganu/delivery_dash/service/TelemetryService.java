package com.nganu.delivery_dash.service;

import com.nganu.delivery_dash.entity.SensorLog;
import com.nganu.delivery_dash.entity.Session;
import com.nganu.delivery_dash.repository.SensorLogRepository;
import com.nganu.delivery_dash.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

/**
 * Menyimpan telemetry MQTT dari ESP32 Master ke sensor_logs.
 * Aturan: data milik sesi berstatus "active" TERBARU (hanya ada 1 Master/sepeda).
 * Tidak peduli sesi dimulai lewat web atau RFID. Field rfid/session dari Master diabaikan di sini.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TelemetryService {

    private final SessionRepository sessionRepository;
    private final SensorLogRepository sensorLogRepository;

    // Parser bawaan Spring Boot: tidak bergantung pada versi Jackson (2 atau 3)
    private final JsonParser jsonParser = JsonParserFactory.getJsonParser();

    /** @return "saved", "no active session", "invalid: ...", atau "error: ..." */
    public String handlePayload(String json) {
        try {
            Map<String, Object> m = jsonParser.parseMap(json);

            if (intField(m, "v", 1, 1) != 1) return "invalid: version";
            int bpm  = intField(m, "bpm", 0, 250);
            boolean link = intField(m, "link", 0, 1) == 1;
            int rpm  = intField(m, "rpm", -1, 1000);   // -1 = sensor belum ada di Master

            Optional<Session> active = sessionRepository.findFirstByStatusOrderByStartTimeDesc("active");
            if (active.isEmpty()) return "no active session";

            // Valid hanya jika Slave terhubung dan ada detak terbaca. Jika tidak: bpm disimpan null
            // (celah di grafik), bukan 0 yang terbaca sebagai detak jantung nol.
            boolean valid = link && bpm > 0;

            sensorLogRepository.save(SensorLog.builder()
                    .session(active.get())
                    .bpm(valid ? bpm : null)
                    .rpm(rpm == -1 ? null : (double) rpm)
                    .isValid(valid)
                    .build());
            return "saved";
        } catch (IllegalArgumentException e) {
            return "invalid: " + e.getMessage();
        } catch (Exception e) {
            log.error("[telemetry] save failed", e);
            return "error: " + e.getClass().getSimpleName();
        }
    }

    private static int intField(Map<String, Object> m, String key, int lo, int hi) {
        Object v = m.get(key);
        if (!(v instanceof Number n) || n.doubleValue() != Math.rint(n.doubleValue()))
            throw new IllegalArgumentException(key + " missing/not integer");
        int i = n.intValue();
        if (i < lo || i > hi) throw new IllegalArgumentException(key + " out of range");
        return i;
    }
}