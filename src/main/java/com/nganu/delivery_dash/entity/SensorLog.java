package com.nganu.delivery_dash.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId; // Menggunakan Long (BIGINT) karena datanya akan sangat banyak

    // Relasi Many-to-One: Banyak log dimiliki oleh 1 Sesi
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime recordedAt = LocalDateTime.now();

    private Integer bpm;

    private Double rpm;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isValid = true;
}