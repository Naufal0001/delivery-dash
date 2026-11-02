package com.nganu.delivery_dash.repository;

import com.nganu.delivery_dash.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA otomatis membuatkan kueri "SELECT * FROM users WHERE rfid_uid
    // = ?"
    Optional<User> findByRfidUid(String rfidUid);
}