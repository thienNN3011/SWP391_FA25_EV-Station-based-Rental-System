package vn.swp391.fa2025.evrental.dto.request;

import lombok.Data;

@Data
public class ShowStaffStatsRequest {
    private String stationName;
    private Long month;
    private Long year;
}
