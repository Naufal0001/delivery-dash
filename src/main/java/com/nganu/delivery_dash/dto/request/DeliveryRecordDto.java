package com.nganu.delivery_dash.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRecordDto {
    private String packageCode;
    private LocalDateTime startedAt; // Spring Boot otomatis mem-parsing format ISO-8601 (T)
    private LocalDateTime deliveredAt;
    private String status;
    private Double distanceM;
    private Integer score;
}