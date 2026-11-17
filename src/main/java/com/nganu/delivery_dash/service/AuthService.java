package com.nganu.delivery_dash.service;

import com.nganu.delivery_dash.dto.request.ManualLoginRequest;
import com.nganu.delivery_dash.dto.request.RfidAuthRequest;
import com.nganu.delivery_dash.dto.response.LoginResponse;
import com.nganu.delivery_dash.entity.Admin;
import com.nganu.delivery_dash.entity.User;
import com.nganu.delivery_dash.repository.AdminRepository;
import com.nganu.delivery_dash.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    /**
     * Login Manual Satu Pintu (Email & Password) untuk Admin dan User.
     */
    public LoginResponse loginManual(ManualLoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        // 1. Cek di tabel Admins terlebih dahulu
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (!verifyPassword(request.getPassword(), admin.getPassword())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email atau password salah");
            }
            if (Boolean.FALSE.equals(admin.getIsActive())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Akun admin dinonaktifkan");
            }

            return LoginResponse.builder()
                    .id(admin.getAdminId())
                    .name(admin.getName())
                    .email(admin.getEmail())
                    .role("ADMIN")
                    .message("Login Admin berhasil")
                    .build();
        }

        // 2. Jika bukan Admin, cek di tabel Users
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email atau password salah"));

        if (!verifyPassword(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email atau password salah");
        }
        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Akun pengguna tidak aktif");
        }

        return buildUserLoginResponse(user, "Login berhasil");
    }

    /**
     * Login Opsional via RFID untuk Web Dashboard (Admin maupun User).
     */
    public LoginResponse loginWithRfid(RfidAuthRequest request) {
        String uid = request.getRfidUid().trim();

        // 1. Cek RFID milik Admin
        Optional<Admin> adminOpt = adminRepository.findByRfidUid(uid);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (Boolean.FALSE.equals(admin.getIsActive())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Akun admin dinonaktifkan");
            }
            return LoginResponse.builder()
                    .id(admin.getAdminId())
                    .name(admin.getName())
                    .email(admin.getEmail())
                    .role("ADMIN")
                    .message("Login RFID Admin berhasil")
                    .build();
        }

        // 2. Cek RFID milik User
        User user = userRepository.findByRfidUid(uid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kartu RFID tidak terdaftar"));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Akun pengguna tidak aktif");
        }

        return buildUserLoginResponse(user, "Login RFID berhasil");
    }

    private LoginResponse buildUserLoginResponse(User user, String message) {
        return LoginResponse.builder()
                .id(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role("USER")
                .weightKg(user.getWeightKg())
                .heightCm(user.getHeightCm())
                .birthDate(user.getBirthDate())
                .message(message)
                .build();
    }

    private boolean verifyPassword(String rawPassword, String storedPassword) {
        if (storedPassword == null)
            return false;
        // Mendukung plain-text saat fase development/seeder
        return rawPassword.equals(storedPassword);
    }
}