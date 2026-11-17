package com.nganu.delivery_dash.repository;

import com.nganu.delivery_dash.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByRfidUid(String rfidUid);
}