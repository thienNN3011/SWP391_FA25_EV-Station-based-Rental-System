package vn.swp391.fa2025.evrental.service;

import java.util.List;
import org.springframework.stereotype.Service;
<<<<<<< HEAD
=======
import org.springframework.transaction.annotation.Transactional;
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
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
<<<<<<< HEAD
    public StationResponse createStation(StationCreateRequest request);
    public StationUpdateResponse updateStation(Long stationId, StationUpdateRequest request);
    public void deleteStation(Long stationId);
=======
    StationResponse getStationById(Long id);
    StationResponse createStation(StationCreateRequest request);
    StationResponse updateStation(Long id, StationUpdateRequest request);
    void deleteStation(Long id);
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
}
