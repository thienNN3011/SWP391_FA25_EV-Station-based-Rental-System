package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.entity.VehicleModel;

import java.util.List;

@Service
public interface VehicleModelService {
    public List<VehicleModelResponse> getVihecleModelsByStationWithActiveTariffs(String stationName);
}
