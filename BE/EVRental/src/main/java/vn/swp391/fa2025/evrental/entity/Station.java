package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "stations")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
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
    private String status;

    @OneToMany(mappedBy = "station")
    private List<User> users;

    @OneToMany(mappedBy = "station")
    private List<Vehicle> vehicles;
}
