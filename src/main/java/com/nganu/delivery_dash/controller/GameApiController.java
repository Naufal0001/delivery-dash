package com.nganu.delivery_dash.controller;

import com.nganu.delivery_dash.dto.request.SessionEndRequest;
import com.nganu.delivery_dash.dto.response.ApiResponse;
import com.nganu.delivery_dash.service.GameApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // CORS diizinkan untuk semua sumber (termasuk Unity)
public class GameApiController {

    private final GameApiService gameApiService;

    // ... (metode authRfid yang sudah ada)

    /**
     * Endpoint untuk menerima rekapitulasi data saat permainan di Unity selesai.
     * URL: POST /api/game/session/{sessionId}/end
     */
    @PostMapping("/session/{sessionId}/end")
    public ResponseEntity<ApiResponse> endSession(
            @PathVariable Long sessionId,
            @RequestBody SessionEndRequest request) {

        // Memanggil service dan membungkus response dalam HTTP 200 OK
        ApiResponse response = gameApiService.endSession(sessionId, request);
        return ResponseEntity.ok(response);
    }
}