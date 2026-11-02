package com.nganu.delivery_dash.repository;

import com.nganu.delivery_dash.entity.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {
}