package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.swp391.fa2025.evrental.enums.IncidentReportStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "incident_reports")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class IncidentReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private LocalDateTime incidentDate;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String description;

    @Column(nullable = false, columnDefinition = "NVARCHAR(500)")
    private String incidentImageUrl;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private IncidentReportStatus status;



}

