package com.nganu.delivery_dash.controller;

import com.nganu.delivery_dash.entity.SensorLog;
import com.nganu.delivery_dash.entity.Session;
import com.nganu.delivery_dash.entity.User;
import com.nganu.delivery_dash.repository.SensorLogRepository;
import com.nganu.delivery_dash.repository.SessionRepository;
import com.nganu.delivery_dash.repository.UserRepository;
import com.nganu.delivery_dash.service.SessionService;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final SensorLogRepository sensorLogRepository;
    private final SessionService sessionService;

    public SessionController(
            SessionRepository sessionRepository,
            UserRepository userRepository,
            SensorLogRepository sensorLogRepository,
            SessionService sessionService) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.sensorLogRepository = sensorLogRepository;
        this.sessionService = sessionService;
    }

    // Tanpa @Transactional: kunci di SessionService harus dilepas SETELAH data commit
    @PostMapping("/start")
    public Map<String, Object> startSession(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId wajib diisi");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));

        // Satu pintu: tidak menimpa sesi user lain (409), melanjutkan sesi user yang sama
        SessionService.StartResult result = sessionService.startSession(user, "WEB");
        Session saved = result.session();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("sessionId", saved.getSessionId());
        response.put("status", saved.getStatus());
        response.put("startTime", saved.getStartTime());
        response.put("resumed", result.resumed());
        return response;
    }

    @PostMapping("/{sessionId}/stop")
    @Transactional
    public Map<String, Object> stopSession(
            @PathVariable Long sessionId,
            @RequestBody(required = false) Map<String, Object> body) {

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sesi tidak ditemukan"));

        List<SensorLog> logs = sensorLogRepository.findBySession_SessionIdOrderByRecordedAtAsc(sessionId);

        double avgBpm = logs.stream()
                .map(SensorLog::getBpm)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        int maxBpm = logs.stream()
                .map(SensorLog::getBpm)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .max()
                .orElse(0);

        double avgRpm = logs.stream()
                .map(SensorLog::getRpm)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);

        double maxRpm = logs.stream()
                .map(SensorLog::getRpm)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .max()
                .orElse(0.0);

        int durationSec = 0;
        if (body != null && body.get("durationSec") instanceof Number) {
            durationSec = ((Number) body.get("durationSec")).intValue();
        }

        double estimatedCalories = Math.round((durationSec / 60.0) * (avgRpm * 0.12) * 10.0) / 10.0;

        session.setStatus("completed");
        session.setEndTime(LocalDateTime.now());
        session.setDurationSec(durationSec);
        session.setAvgBpm(Math.round(avgBpm * 10.0) / 10.0);
        session.setMaxBpm(maxBpm);
        session.setAvgRpm(Math.round(avgRpm * 10.0) / 10.0);
        session.setMaxRpm(maxRpm);
        session.setCaloriesKcal(estimatedCalories);

        sessionRepository.save(session);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("sessionId", session.getSessionId());
        response.put("status", session.getStatus());
        response.put("durationSec", session.getDurationSec());
        response.put("avgBpm", session.getAvgBpm());
        response.put("avgRpm", session.getAvgRpm());
        response.put("caloriesKcal", session.getCaloriesKcal());
        return response;
    }

    @GetMapping("/{sessionId}/latest")
    public Map<String, Object> getLatestTelemetry(@PathVariable Long sessionId) {
        List<SensorLog> logs = sensorLogRepository.findBySession_SessionIdOrderByRecordedAtAsc(sessionId);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalPoints", logs.size());

        if (logs.isEmpty()) {
            response.put("bpm", null);
            response.put("rpm", null);
            response.put("recordedAt", null);
        } else {
            SensorLog latest = logs.get(logs.size() - 1);
            response.put("bpm", latest.getBpm());
            response.put("rpm", latest.getRpm());
            response.put("recordedAt", latest.getRecordedAt());
        }
        return response;
    }
}