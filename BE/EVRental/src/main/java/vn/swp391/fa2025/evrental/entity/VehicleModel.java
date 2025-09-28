package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "[VehicleModel]")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "model_id")
    private Long modelId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "brand", nullable = false)
    private String brand;

    @Column(name = "battery_capacity", nullable = false)
    private Long batteryCapacity;

    @Column(name = "range", nullable = false)
    private Long range;

    @Column(name = "seat", nullable = false)
    private Integer seat;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "model")
    private List<Vehicle> vehicles;

    @OneToMany(mappedBy = "model")
    private List<Tariff> tariffs;
}
