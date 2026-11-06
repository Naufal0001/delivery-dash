package com.nganu.delivery_dash.controller;

import com.nganu.delivery_dash.dto.request.RfidAuthRequest;
import com.nganu.delivery_dash.dto.request.SessionEndRequest;
import com.nganu.delivery_dash.dto.response.ApiResponse;
import com.nganu.delivery_dash.dto.response.AuthResponse;
import com.nganu.delivery_dash.dto.response.ChartDataResponse;
import com.nganu.delivery_dash.service.GameApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Mengizinkan akses untuk semua sumber (Unity/React)
public class GameApiController {

    private final GameApiService gameApiService;

    // 1. Endpoint Autentikasi RFID
    // POST http://localhost:8080/api/game/auth
    @PostMapping("/auth")
    public ResponseEntity<AuthResponse> authRfid(@RequestBody RfidAuthRequest request) {
        AuthResponse response = gameApiService.authenticateAndStartSession(request);
        return ResponseEntity.ok(response);
    }

    // 2. Endpoint Terima Ringkasan Akhir Game (Unity)
    // POST http://localhost:8080/api/game/session/{sessionId}/end
    @PostMapping("/session/{sessionId}/end")
    public ResponseEntity<ApiResponse> endSession(
            @PathVariable Long sessionId,
            @RequestBody SessionEndRequest request) {
        ApiResponse response = gameApiService.endSession(sessionId, request);
        return ResponseEntity.ok(response);
    }

    // 3. Endpoint Tarik Data Grafik (React Web Dashboard)
    // GET http://localhost:8080/api/game/session/{sessionId}/chart
    @GetMapping("/session/{sessionId}/chart")
    public ResponseEntity<ChartDataResponse> getSessionChart(@PathVariable Long sessionId) {
        ChartDataResponse chartData = gameApiService.getChartData(sessionId);
        return ResponseEntity.ok(chartData);
    }
}