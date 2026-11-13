package com.nganu.delivery_dash.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RfidAuthRequest {
    // Menangkap field "rfidUid" dari request body JSON
    @NotBlank(message = "rfidUid tidak boleh kosong")
    private String rfidUid;
}
