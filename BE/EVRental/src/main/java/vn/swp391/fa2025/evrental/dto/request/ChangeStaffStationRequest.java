package vn.swp391.fa2025.evrental.dto.request;

import lombok.Data;

@Data
public class ChangeStaffStationRequest {
    private String stationName;
    private Long staffId;
}
