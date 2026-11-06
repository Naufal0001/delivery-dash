package com.nganu.delivery_dash.repository;

import com.nganu.delivery_dash.entity.SensorLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SensorLogRepository extends JpaRepository<SensorLog, Long> {

    // Custom query: Mengambil seluruh log sensor milik satu sesi dan diurutkan
    // berdasarkan waktu (Ascending)
    List<SensorLog> findBySession_SessionIdOrderByRecordedAtAsc(Long sessionId);

}