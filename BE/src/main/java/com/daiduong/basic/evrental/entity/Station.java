package com.daiduong.basic.evrental.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "[Station]")
@Data
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "station_id")
    private Long stationId;

    @Column(name = "station_name", nullable = false)
    private String stationName;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "opening_hours", nullable = false)
    private String openingHours;

    @Column(name = "status", nullable = false)
    private String status;
}
