package com.nganu.delivery_dash.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private String role; // "USER" atau "ADMIN"

    // Data profil tambahan (khusus USER, null jika ADMIN)
    private Double weightKg;
    private Double heightCm;
    private LocalDate birthDate;

    private String message;
}