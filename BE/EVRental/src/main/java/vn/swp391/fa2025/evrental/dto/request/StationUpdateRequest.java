package vn.swp391.fa2025.evrental.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StationUpdateRequest {

    private String stationName;
    private String address;
    private String openingHours;
    private String status;
}