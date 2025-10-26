package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "tariffs")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Tariff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tariffId;

    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private VehicleModel model;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Long numberOfContractAppling;

    @Column(nullable = false)
    private BigDecimal depositAmount;

    @Column(nullable = false)
    private String status;

    @OneToMany(mappedBy = "tariff")
    private List<Booking> bookings;
}
