package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.*;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.entity.VehicleModel;

import java.util.List;

@Service
public interface VehicleModelService {
    public List<VehicleModelResponse> getVihecleModelsByStationWithActiveTariffs(String stationName);
    public VehicleModelResponse getVihecleModelByVehicleModelIdAndStationName(String stationName, Long modelId);
    List<VehicleModelResponse> showAllVehicleModel();
    VehicleModelResponse getVehicleModelById(Long id);
    VehicleModelResponse createVehicleModel(VehicleModelCreateRequest request);
    VehicleModelResponse updateVehicleModel(Long id, VehicleModelUpdateRequest request);
    VehicleModelResponse addImagesToVehicleModel(Long id, VehicleModelAddImageRequest request);
    void deleteVehicleModel(Long id);
    void deleteImageFromVehicleModel(Long modelId, VehicleModelDeleteImageRequest request);
}
