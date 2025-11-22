package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.swp391.fa2025.evrental.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Booking Entity - Đơn thuê xe
 * Lifecycle: BOOKING → UNCONFIRMED → RENTING → COMPLETED / CANCELLED / NO_SHOW
 */
@Entity
@Table(name = "bookings")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDateTime startTime;        // Thời gian dự kiến bắt đầu

    @Column(nullable = false)
    private LocalDateTime endTime;          // Thời gian dự kiến kết thúc

    private LocalDateTime actualStartTime;  // Thời gian thực tế bắt đầu (khi staff giao xe)
    private LocalDateTime actualEndTime;    // Thời gian thực tế kết thúc (khi staff nhận xe)

    @ManyToOne
    @JoinColumn(name = "tariffId", nullable = false)
    private Tariff tariff;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    private Long startOdo;  // Số km đồng hồ lúc bắt đầu thuê
    private Long endOdo;    // Số km đồng hồ lúc trả xe (quãng đường = endOdo - startOdo)

    private String beforeRentingStatus;  // Tình trạng xe trước khi thuê
    private String afterRentingStatus;   // Tình trạng xe sau khi trả

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Contract contract;

    @OneToMany(mappedBy = "booking")
    private List<Payment> payments;

    @OneToMany(mappedBy = "booking")
    private List<IncidentReport> incidentReports;

    @Column
    private String bankName;     // Tên ngân hàng (để hoàn tiền)

    @Column
    private String bankAccount;  // Số tài khoản (để hoàn tiền)
}
