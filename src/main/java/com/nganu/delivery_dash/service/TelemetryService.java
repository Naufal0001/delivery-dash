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

            if (intField(m, "v", 1, 1) != 1)
                return "invalid: version";
            int bpm = intField(m, "bpm", 0, 250);
            boolean link = intField(m, "link", 0, 1) == 1;
            double rpm = doubleField(m, "rpm", -1.0, 1000.0); // Mendukung integer maupun desimal

            Optional<Session> active = sessionRepository.findFirstByStatusOrderByStartTimeDesc("active");
            if (active.isEmpty())
                return "no active session";

            boolean valid = link && bpm > 0;

            sensorLogRepository.save(SensorLog.builder()
                    .session(active.get())
                    .bpm(valid ? bpm : null)
                    .rpm(rpm == -1.0 ? null : rpm)
                    .recordedAt(LocalDateTime.now()) // Wajib diisi agar endpoint /chart tidak NullPointerException
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
        if (i < lo || i > hi)
            throw new IllegalArgumentException(key + " out of range");
        return i;
    }

    private static double doubleField(Map<String, Object> m, String key, double lo, double hi) {
        Object v = m.get(key);
        if (!(v instanceof Number n))
            throw new IllegalArgumentException(key + " missing/not number");
        double d = n.doubleValue();
        if (d < lo || d > hi)
            throw new IllegalArgumentException(key + " out of range");
        return d;
    }
}