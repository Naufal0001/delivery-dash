package com.nganu.delivery_dash.controller;

import com.nganu.delivery_dash.dto.request.RfidAuthRequest;
import com.nganu.delivery_dash.dto.response.AuthResponse;
import com.nganu.delivery_dash.service.GameApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Mengizinkan akses dari domain luar (Unity, Vue, ESP32)
public class GameApiController {

    private final GameApiService gameApiService;

    /**
     * Endpoint untuk autentikasi RFID dari perangkat keras ESP32.
     * URL: POST /api/game/auth
     */
    @PostMapping("/auth")
    public ResponseEntity<AuthResponse> authRfid(@RequestBody RfidAuthRequest request) {
        // Mengirim request ke Service dan membungkus hasil kembaliannya ke dalam HTTP
        // 200 (OK)
        AuthResponse response = gameApiService.authenticateAndStartSession(request);
        return ResponseEntity.ok(response);
    }
}