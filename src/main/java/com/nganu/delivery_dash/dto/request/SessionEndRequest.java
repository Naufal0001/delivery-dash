package com.nganu.delivery_dash.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionEndRequest {

    @NotNull(message = "Jarak (distanceM) wajib diisi")
    @Min(value = 0, message = "Jarak tidak boleh minus")
    private Double distanceM;

    @NotNull(message = "Durasi (durationSec) wajib diisi")
    @Min(value = 0, message = "Durasi tidak boleh minus")
    private Integer durationSec;

    @Min(value = 0, message = "Rata-rata RPM tidak boleh minus")
    private Double avgRpm;

    private Double maxRpm;

    @Min(value = 0, message = "Rata-rata BPM tidak boleh minus")
    private Double avgBpm;

    private Integer maxBpm;

    @NotNull(message = "Kalori (caloriesKcal) wajib diisi")
    @Min(value = 0, message = "Kalori tidak boleh minus")
    private Double caloriesKcal;

    @NotNull(message = "Skor total (totalScore) wajib diisi")
    @Min(value = 0, message = "Skor total tidak boleh minus")
    private Integer totalScore;

    // Wajib menambahkan @Valid agar validasi berantai (nested validation) di dalam
    // list ikut dieksekusi
    @Valid
    private List<DeliveryRecordDto> deliveries;
}