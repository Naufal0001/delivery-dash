package com.nganu.delivery_dash.repository;

import com.nganu.delivery_dash.entity.SensorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SensorLogRepository extends JpaRepository<SensorLog, Long> {
    // Custom query: Mencari semua log berdasarkan ID Sesi
    List<SensorLog> findBySession_SessionIdOrderByRecordedAtAsc(Long sessionId);
}