package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "[Tariff]")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Tariff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tariff_id")
    private Long tariffId;

    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private VehicleModel model;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "price", nullable = false, precision = 12, scale = 2)
    private java.math.BigDecimal price;

    @Column(name = "number_of_contract_appling", nullable = false)
    private Long numberOfContractAppling;

    @Column(name = "deposit_amount", nullable = false, precision = 12, scale = 2)
    private java.math.BigDecimal depositAmount;

    @Column(name = "status", nullable = false)
    private String status;
}
