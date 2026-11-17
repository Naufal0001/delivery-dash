package com.nganu.delivery_dash.controller;

import com.nganu.delivery_dash.dto.request.ManualLoginRequest;
import com.nganu.delivery_dash.dto.request.RfidAuthRequest;
import com.nganu.delivery_dash.dto.response.LoginResponse;
import com.nganu.delivery_dash.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    // 1. Login Manual (Email & Password) - Utama
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginManual(@Valid @RequestBody ManualLoginRequest request) {
        return ResponseEntity.ok(authService.loginManual(request));
    }

    // 2. Login RFID - Opsional
    @PostMapping("/rfid")
    public ResponseEntity<LoginResponse> loginRfid(@Valid @RequestBody RfidAuthRequest request) {
        return ResponseEntity.ok(authService.loginWithRfid(request));
    }
}