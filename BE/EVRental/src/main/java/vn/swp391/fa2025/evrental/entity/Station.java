package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.swp391.fa2025.evrental.enums.StationStatus;

import java.util.List;

@Entity
@Table(name = "stations")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stationId;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String stationName;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(nullable = false)
    private String openingHours;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StationStatus status;

    @OneToMany(mappedBy = "station")
    private List<User> users;

    @OneToMany(mappedBy = "station")
    private List<Vehicle> vehicles;
}
