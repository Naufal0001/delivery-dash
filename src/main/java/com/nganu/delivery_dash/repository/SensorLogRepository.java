package com.nganu.delivery_dash.repository;

import com.nganu.delivery_dash.entity.SensorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SensorLogRepository extends JpaRepository<SensorLog, Long> {

    // Custom query: Mengambil seluruh log sensor milik satu sesi dan diurutkan
    // berdasarkan waktu (Ascending)
    List<SensorLog> findBySession_SessionIdOrderByRecordedAtAsc(Long sessionId);

    // Waktu pembacaan valid terakhir (kosong jika belum pernah ada)
    @Query("select max(l.recordedAt) from SensorLog l where l.session.sessionId = :sessionId and l.isValid = true")
    Optional<LocalDateTime> findLastValidAt(@Param("sessionId") Long sessionId);
}
