package com.nganu.delivery_dash.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RfidAuthRequest {
    // Menangkap field "rfidUid" dari request body JSON
    private String rfidUid;
}
