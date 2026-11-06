package com.nganu.delivery_dash.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionEndRequest {
    private Double distanceM;
    private Integer durationSec;
    private Double avgRpm;
    private Double maxRpm;
    private Double avgBpm;
    private Integer maxBpm;
    private Double caloriesKcal;
    private Integer totalScore;

    // Menerima array riwayat pengiriman paket
    private List<DeliveryRecordDto> deliveries;
}