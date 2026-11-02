package com.nganu.delivery_dash.repository;

import com.nganu.delivery_dash.entity.DeliveryHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryHistoryRepository extends JpaRepository<DeliveryHistory, Long> {
    List<DeliveryHistory> findBySession_SessionId(Long sessionId);
}