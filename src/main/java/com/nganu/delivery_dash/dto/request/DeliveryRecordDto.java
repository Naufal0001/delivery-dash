package com.nganu.delivery_dash.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRecordDto {
    @NotBlank(message = "Kode paket (packageCode) tidak boleh kosong")
    private String packageCode;

    private LocalDateTime startedAt;
    private LocalDateTime deliveredAt;

    @NotBlank(message = "Status pengiriman tidak boleh kosong")
    private String status;

    @Min(value = 0, message = "Jarak (distanceM) tidak boleh minus")
    private Double distanceM;

    @Min(value = 0, message = "Skor tidak boleh minus")
    private Integer score;
}