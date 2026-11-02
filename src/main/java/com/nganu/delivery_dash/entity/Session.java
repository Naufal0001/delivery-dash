package com.nganu.delivery_dash.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    // Relasi Many-to-One: Banyak sesi bisa dimiliki 1 User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime startTime = LocalDateTime.now();

    private LocalDateTime endTime;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "active"; // active, completed, aborted

    private Double weightKg;

    @Builder.Default
    private Integer durationSec = 0;

    @Builder.Default
    private Double distanceM = 0.0;

    private Double avgRpm;
    private Double maxRpm;
    private Double avgBpm;
    private Integer maxBpm;
    private Double caloriesKcal;

    @Builder.Default
    private Integer totalScore = 0;
}
