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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TelemetryService {

    private final SessionRepository sessionRepository;
    private final SensorLogRepository sensorLogRepository;
    private final JsonParser jsonParser = JsonParserFactory.getJsonParser();

    @Transactional
    public String handlePayload(String json) {
        try {
            Map<String, Object> m = jsonParser.parseMap(json);

            // Version opsional: jika dikirim wajib 1, jika tidak dikirim dianggap 1
            if (m.containsKey("v") && m.get("v") != null) {
                int v = intField(m, "v", 1, 1);
                if (v != 1)
                    return "invalid: version";
            }

            int bpm = intField(m, "bpm", 0, 250);
            double rpm = m.containsKey("rpm") && m.get("rpm") != null
                    ? doubleField(m, "rpm", -1.0, 1000.0)
                    : 0.0;

            // Link opsional: jika tidak dikirim, dianggap terhubung (true)
            boolean link = !m.containsKey("link") || m.get("link") == null || intField(m, "link", 0, 1) == 1;

            // Cari sesi aktif terbaru di database
            Optional<Session> active = sessionRepository.findFirstByStatusOrderByStartTimeDesc("active");
            if (active.isEmpty()) {
                return "no active session";
            }

            boolean valid = link && bpm > 0;

            SensorLog savedLog = sensorLogRepository.save(SensorLog.builder()
                    .session(active.get())
                    .bpm(valid ? bpm : null)
                    .rpm(rpm < 0 ? null : rpm)
                    .recordedAt(LocalDateTime.now())
                    .isValid(valid)
                    .build());

            log.info("[telemetry] tersimpan ke DB -> logId={}, sessionId={}, bpm={}, rpm={}",
                    savedLog.getLogId(), active.get().getSessionId(), savedLog.getBpm(), savedLog.getRpm());

            return "saved";
        } catch (IllegalArgumentException e) {
            return "invalid: " + e.getMessage();
        } catch (Exception e) {
            log.error("[telemetry] gagal menyimpan ke DB", e);
            return "error: " + e.getClass().getSimpleName();
        }
    }

    private static int intField(Map<String, Object> m, String key, int lo, int hi) {
        Object v = m.get(key);
        if (!(v instanceof Number n)) {
            throw new IllegalArgumentException(key + " missing/not number");
        }
        int i = (int) Math.round(n.doubleValue());
        if (i < lo || i > hi) {
            throw new IllegalArgumentException(key + " out of range");
        }
        return i;
    }

    private static double doubleField(Map<String, Object> m, String key, double lo, double hi) {
        Object v = m.get(key);
        if (!(v instanceof Number n)) {
            throw new IllegalArgumentException(key + " missing/not number");
        }
        double d = n.doubleValue();
        if (d < lo || d > hi) {
            throw new IllegalArgumentException(key + " out of range");
        }
        return d;
    }
}