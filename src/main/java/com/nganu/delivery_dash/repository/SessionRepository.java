package com.nganu.delivery_dash.repository;

import com.nganu.delivery_dash.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findFirstByStatusOrderByStartTimeDesc(String status);

    // Sesi aktif beserta user-nya (join fetch: user bisa dibaca di luar transaksi), terbaru dulu
    @Query("select s from Session s join fetch s.user where s.status = 'active' order by s.startTime desc")
    List<Session> findActiveWithUser();
}
