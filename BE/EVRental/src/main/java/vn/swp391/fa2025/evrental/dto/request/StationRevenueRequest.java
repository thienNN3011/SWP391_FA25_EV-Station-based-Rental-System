package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StationRevenueRequest {
    @NotNull
    private String stationName;
    @NotNull
    private int year;
}
