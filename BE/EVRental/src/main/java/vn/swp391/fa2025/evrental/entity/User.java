package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "[User]")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role; // USER / STAFF / ADMIN

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(unique = true)
    private String idCard;

    @Column(unique = true)
    private String driveLicense;

    @Column(nullable = false)
    private String status;

    private String idCardPhoto;

    private String driveLicensePhoto;

    @ManyToOne
    @JoinColumn(name = "station_id")
    private Station station;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "user")
    private List<Booking> bookings;

    @OneToMany(mappedBy = "user")
    private List<Contract> contracts;

    @OneToMany(mappedBy = "staff")
    private List<Contract> managedContracts;
}
