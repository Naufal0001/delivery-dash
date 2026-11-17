package com.nganu.delivery_dash.config;

import com.nganu.delivery_dash.entity.Admin;
import com.nganu.delivery_dash.entity.User;
import com.nganu.delivery_dash.repository.AdminRepository;
import com.nganu.delivery_dash.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        seedAdmins();
        seedUsers();
    }

    private void seedAdmins() {
        if (adminRepository.count() > 0) {
            return;
        }

        Admin defaultAdmin = Admin.builder()
                .name("Administrator DeliveryDash")
                .email("admin@deliverydash.com")
                .password("admin123")
                .rfidUid("RFID-ADMIN-01")
                .isActive(true)
                .build();

        adminRepository.save(defaultAdmin);
        log.info("DatabaseSeeder: Akun Admin default berhasil dibuat (admin@deliverydash.com)");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            return;
        }

        User riderWithRfid = User.builder()
                .name("Mas Ogi")
                .email("ogi@anu.com")
                .password("ogi123")
                .rfidUid("RFID-USER-01")
                .birthDate(LocalDate.of(2004, 5, 15))
                .gender("L")
                .weightKg(65.0)
                .heightCm(172.0)
                .maxHr(198)
                .isActive(true)
                .build();

        User riderManualOnly = User.builder()
                .name("Siti Aminah")
                .email("siti@deliverydash.com")
                .password("user123")
                .rfidUid(null) // Menguji akun tanpa kartu RFID
                .birthDate(LocalDate.of(2003, 9, 20))
                .gender("P")
                .weightKg(54.0)
                .heightCm(160.0)
                .maxHr(197)
                .isActive(true)
                .build();

        userRepository.saveAll(List.of(riderWithRfid, riderManualOnly));
        log.info("DatabaseSeeder: 2 akun User default berhasil dibuat.");
    }
}