package com.nganu.delivery_dash.service;

import com.nganu.delivery_dash.dto.request.RfidAuthRequest;
import com.nganu.delivery_dash.dto.response.AuthResponse;
import com.nganu.delivery_dash.entity.Session;
import com.nganu.delivery_dash.entity.User;
import com.nganu.delivery_dash.repository.SessionRepository;
import com.nganu.delivery_dash.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor // Lombok: otomatis membuat constructor untuk dependency injection
public class GameApiService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    /**
     * Memproses autentikasi RFID dan membuat sesi permainan baru.
     * Menggunakan @Transactional agar jika terjadi kegagalan sistem, insert session
     * dibatalkan (rollback).
     */
    @Transactional
    public AuthResponse authenticateAndStartSession(RfidAuthRequest request) {

        // 1. Cari pengguna berdasarkan RFID UID. Jika tidak ada, lempar error 404.
        User user = userRepository.findByRfidUid(request.getRfidUid())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "RFID tidak terdaftar"));

        // 2. Validasi status keaktifan akun. Jika tidak aktif, lempar error 403.
        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Akun tidak aktif");
        }

        // 3. Buat entitas Sesi baru
        Session newSession = Session.builder()
                .user(user)
                .status("active")
                .weightKg(user.getWeightKg()) // Snapshot berat badan untuk kalkulasi kalori
                .startTime(LocalDateTime.now())
                .build();

        // 4. Simpan sesi ke database
        Session savedSession = sessionRepository.save(newSession);

        // 5. Kembalikan respons sukses
        return AuthResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .sessionId(savedSession.getSessionId())
                .message("Login berhasil, sesi permainan dimulai")
                .build();
    }
}