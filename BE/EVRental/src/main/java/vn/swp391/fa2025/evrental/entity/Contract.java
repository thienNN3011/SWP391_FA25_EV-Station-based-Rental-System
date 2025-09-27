package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "[Contract]")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contractId;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // khách hàng

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    private User staff; // nhân viên quản lý

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String contractPhoto;

    @Column(nullable = false)
    private String digitalSignature;

    @Column(nullable = false)
    private String status;
}

