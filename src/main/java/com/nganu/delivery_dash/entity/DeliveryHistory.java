package com.nganu.delivery_dash.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deliveryId;

    // Relasi Many-to-One: Banyak riwayat pengiriman dimiliki oleh 1 Sesi
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(nullable = false, length = 30)
    private String packageCode;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    private LocalDateTime deliveredAt;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "on_going"; // on_going, delivered, failed

    private Double distanceM;

    @Column(nullable = false)
    @Builder.Default
    private Integer score = 0;
}