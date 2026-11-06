package com.nganu.delivery_dash.service;

import com.nganu.delivery_dash.dto.request.RfidAuthRequest;
import com.nganu.delivery_dash.dto.request.SessionEndRequest;
import com.nganu.delivery_dash.dto.response.ApiResponse;
import com.nganu.delivery_dash.dto.response.AuthResponse;
import com.nganu.delivery_dash.dto.response.ChartDataResponse;
import com.nganu.delivery_dash.entity.DeliveryHistory;
import com.nganu.delivery_dash.entity.SensorLog;
import com.nganu.delivery_dash.entity.Session;
import com.nganu.delivery_dash.entity.User;
import com.nganu.delivery_dash.repository.DeliveryHistoryRepository;
import com.nganu.delivery_dash.repository.SensorLogRepository;
import com.nganu.delivery_dash.repository.SessionRepository;
import com.nganu.delivery_dash.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameApiService {

        private final UserRepository userRepository;
        private final SessionRepository sessionRepository;
        private final DeliveryHistoryRepository deliveryHistoryRepository;
        private final SensorLogRepository sensorLogRepository;

        // --- TUGAS 1: AUTENTIKASI RFID ---
        @Transactional
        public AuthResponse authenticateAndStartSession(RfidAuthRequest request) {
                User user = userRepository.findByRfidUid(request.getRfidUid())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "RFID tidak terdaftar"));

                if (Boolean.FALSE.equals(user.getIsActive())) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Akun tidak aktif");
                }

                Session newSession = Session.builder()
                                .user(user)
                                .status("active")
                                .weightKg(user.getWeightKg())
                                .startTime(LocalDateTime.now())
                                .build();

                Session savedSession = sessionRepository.save(newSession);

                return AuthResponse.builder()
                                .userId(user.getUserId())
                                .name(user.getName())
                                .sessionId(savedSession.getSessionId())
                                .message("Login berhasil, sesi permainan dimulai")
                                .build();
        }

        // --- TUGAS 2: AKHIRI SESI DARI UNITY ---
        @Transactional
        public ApiResponse endSession(Long sessionId, SessionEndRequest request) {
                Session session = sessionRepository.findById(sessionId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Sesi tidak ditemukan"));

                if ("completed".equalsIgnoreCase(session.getStatus())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sesi sudah completed.");
                }

                session.setDistanceM(request.getDistanceM());
                session.setDurationSec(request.getDurationSec());
                session.setAvgRpm(request.getAvgRpm());
                session.setMaxRpm(request.getMaxRpm());
                session.setAvgBpm(request.getAvgBpm());
                session.setMaxBpm(request.getMaxBpm());
                session.setCaloriesKcal(request.getCaloriesKcal());
                session.setTotalScore(request.getTotalScore());
                session.setEndTime(LocalDateTime.now());
                session.setStatus("completed");

                if (request.getDeliveries() != null && !request.getDeliveries().isEmpty()) {
                        List<DeliveryHistory> histories = request.getDeliveries().stream()
                                        .map(dto -> DeliveryHistory.builder()
                                                        .session(session)
                                                        .packageCode(dto.getPackageCode())
                                                        .startedAt(dto.getStartedAt())
                                                        .deliveredAt(dto.getDeliveredAt())
                                                        .status(dto.getStatus())
                                                        .distanceM(dto.getDistanceM())
                                                        .score(dto.getScore())
                                                        .build())
                                        .collect(Collectors.toList());
                        deliveryHistoryRepository.saveAll(histories);
                }

                sessionRepository.save(session);

                return ApiResponse.builder()
                                .success(true)
                                .message("Sesi permainan berhasil disimpan dan diselesaikan.")
                                .build();
        }

        // --- TUGAS 3: TARIK DATA GRAFIK DASHBOARD ---
        public ChartDataResponse getChartData(Long sessionId) {
                List<SensorLog> logs = sensorLogRepository.findBySession_SessionIdOrderByRecordedAtAsc(sessionId);
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

                List<String> labels = logs.stream()
                                .map(log -> log.getRecordedAt().format(timeFormatter))
                                .collect(Collectors.toList());

                List<Integer> bpmData = logs.stream().map(SensorLog::getBpm).collect(Collectors.toList());
                List<Double> rpmData = logs.stream().map(SensorLog::getRpm).collect(Collectors.toList());

                return ChartDataResponse.builder()
                                .labels(labels)
                                .bpmData(bpmData)
                                .rpmData(rpmData)
                                .build();
        }
}