package com.nganu.delivery_dash.repository;

import com.nganu.delivery_dash.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByRfidUid(String rfidUid);
}