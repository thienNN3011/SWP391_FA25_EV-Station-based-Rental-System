package vn.swp391.fa2025.evrental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "system_config")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SystemConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "config_key", nullable = false)
    private String key;
    @Column(nullable = false)
    private String value;
}
