package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    private LocalDateTime actualStartTime;
    private LocalDateTime actualEndTime;

    @ManyToOne
    @JoinColumn(name = "tariffId", nullable = false)
    private Tariff tariff;

    @Column(nullable = false)
    private Double totalAmount;

    private Long startOdo;
    private Long endOdo;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @Column(nullable = false)
    private String status;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Contract contract;

    @OneToMany(mappedBy = "booking")
    private List<Payment> payments;

    @OneToMany(mappedBy = "booking")
    private List<IncidentReport> incidentReports;
}
