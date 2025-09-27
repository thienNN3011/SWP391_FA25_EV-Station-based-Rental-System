package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "[Station]")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stationId;

    @Column(nullable = false)
    private String stationName;

    @Column(nullable = false)
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
