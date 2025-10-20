package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "model_image_urls")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ModelImageUrl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @Column(length = 50, nullable = false)
    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private VehicleModel model;
}
