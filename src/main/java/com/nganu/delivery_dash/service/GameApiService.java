package com.nganu.delivery_dash.service;

import com.nganu.delivery_dash.dto.request.SessionEndRequest;
import com.nganu.delivery_dash.dto.request.DeliveryRecordDto;
import com.nganu.delivery_dash.dto.response.ApiResponse;
import com.nganu.delivery_dash.entity.DeliveryHistory;
import com.nganu.delivery_dash.entity.Session;
import com.nganu.delivery_dash.repository.DeliveryHistoryRepository;
import com.nganu.delivery_dash.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameApiService {

    private final SessionRepository sessionRepository;
    private final DeliveryHistoryRepository deliveryHistoryRepository;

    // ... (metode authenticateAndStartSession yang sudah ada)

    /**
     * Memproses penerimaan ringkasan sesi olahraga dan riwayat pengiriman paket.
     * 
     * @Transactional memastikan jika terjadi gagal simpan pada riwayat paket,
     *                status sesi tidak akan berubah menjadi completed (terhindar
     *                dari data korup).
     */
    @Transactional
    public ApiResponse endSession(Long sessionId, SessionEndRequest request) {

        // 1. Validasi keberadaan sesi
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Sesi tidak ditemukan"));

        // 2. Validasi State Machine (Hanya sesi 'active' yang boleh diselesaikan)
        if ("completed".equalsIgnoreCase(session.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Sesi ini sudah berstatus completed dan tidak dapat diubah lagi.");
        }

        // 3. Update atribut metrik sesi dari payload Unity
        session.setDistanceM(request.getDistanceM());
        session.setDurationSec(request.getDurationSec());
        session.setAvgRpm(request.getAvgRpm());
        session.setMaxRpm(request.getMaxRpm());
        session.setAvgBpm(request.getAvgBpm());
        session.setMaxBpm(request.getMaxBpm());
        session.setCaloriesKcal(request.getCaloriesKcal());
        session.setTotalScore(request.getTotalScore());

        // 4. Ubah status dan waktu selesai
        session.setEndTime(LocalDateTime.now());
        session.setStatus("completed");

        // 5. Mapping & Batch Insert riwayat pengiriman (Deliveries)
        if (request.getDeliveries() != null && !request.getDeliveries().isEmpty()) {
            List<DeliveryHistory> histories = request.getDeliveries().stream()
                    .map(dto -> DeliveryHistory.builder()
                            .session(session) // Mengikat relasi ke sesi saat ini
                            .packageCode(dto.getPackageCode())
                            .startedAt(dto.getStartedAt())
                            .deliveredAt(dto.getDeliveredAt())
                            .status(dto.getStatus())
                            .distanceM(dto.getDistanceM())
                            .score(dto.getScore())
                            .build())
                    .collect(Collectors.toList());

            // Simpan seluruh riwayat ke database (batch insert)
            deliveryHistoryRepository.saveAll(histories);
        }

        // 6. Simpan pembaruan sesi
        sessionRepository.save(session);

        return ApiResponse.builder()
                .success(true)
                .message("Sesi permainan berhasil disimpan dan diselesaikan.")
                .build();
    }
}