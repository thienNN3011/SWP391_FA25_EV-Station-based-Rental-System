package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "vehicle_models")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class VehicleModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long modelId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private Long batteryCapacity;

    @Column(nullable = false)
    private Long range;

    @Column(nullable = false)
    private Integer seat;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;

    @OneToMany(mappedBy = "model", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ModelImageUrl> imageUrls;

    @OneToMany(mappedBy = "model")
    private List<Vehicle> vehicles;

    @OneToMany(mappedBy = "model")
    private List<Tariff> tariffs;
}
