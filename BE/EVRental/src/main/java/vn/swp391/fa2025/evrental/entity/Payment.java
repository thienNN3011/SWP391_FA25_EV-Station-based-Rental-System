package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
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
    private BigDecimal amount;

    @Column(nullable = false)
    private String referenceCode;

    @Column(nullable = false)
    private LocalDateTime transactionDate;
}
