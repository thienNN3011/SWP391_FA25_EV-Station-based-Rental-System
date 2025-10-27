package vn.swp391.fa2025.evrental.service;

import java.util.List;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.StationCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.StationUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.MyStationResponse;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.dto.response.StationUpdateResponse;
import vn.swp391.fa2025.evrental.entity.Station;

@Service
public interface StationService {
    public List<StationResponse> showActiveStation();
    public MyStationResponse getCurrentStaffStation(String username);
    public StationResponse createStation(StationCreateRequest request);
    public StationUpdateResponse updateStation(Long stationId, StationUpdateRequest request);
    public void deleteStation(Long stationId);
}
