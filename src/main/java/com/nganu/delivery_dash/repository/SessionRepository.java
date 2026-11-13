package com.nganu.delivery_dash.repository;

import com.nganu.delivery_dash.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
       Optional<Session> findFirstByStatusOrderByStartTimeDesc(String status);
}