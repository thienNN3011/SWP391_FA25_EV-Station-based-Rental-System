package vn.swp391.fa2025.evrental.service;

import java.util.List;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.StationCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.StationUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.Station;

@Service
public interface StationService {
    public List<StationShowAllResponse> showAllStation();
    public List<StationResponse> showActiveStation();
    public MyStationResponse getCurrentStaffStation(String username);
    public StationResponse createStation(StationCreateRequest request);
    public StationUpdateResponse updateStation(Long stationId, StationUpdateRequest request);
    public void deleteStation(Long stationId);
    public StationVehicleStatsResponse getStationVehicleStats(Long stationId);
}
