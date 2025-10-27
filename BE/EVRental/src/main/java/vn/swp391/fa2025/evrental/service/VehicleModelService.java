package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;

import java.util.List;

@Service
public interface VehicleModelService {
    public List<VehicleModelResponse> getVihecleModelsByStationWithActiveTariffs(String stationName);
    public VehicleModelResponse getVihecleModelByVehicleModelIdAndStationName(String stationName, Long modelId);

    List<VehicleModelResponse> showAllVehicleModels();

    VehicleModelResponse getVehicleModelById(Long id);

    VehicleModelResponse createVehicleModel(VehicleModelCreateRequest request);

    VehicleModelResponse updateVehicleModel(Long id, VehicleModelUpdateRequest request);

    void deleteVehicleModel(Long id);

}
