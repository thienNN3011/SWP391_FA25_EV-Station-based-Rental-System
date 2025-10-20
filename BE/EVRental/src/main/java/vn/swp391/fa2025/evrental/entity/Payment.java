package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private String paymentType;

    @Column(nullable = false)
    private String method;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String referenceCode;

    @Column(nullable = false)
    private LocalDateTime transactionDate;
}
