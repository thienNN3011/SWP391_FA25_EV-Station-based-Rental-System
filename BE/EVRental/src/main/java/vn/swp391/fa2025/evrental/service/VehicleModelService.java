package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelCreateRequest;
<<<<<<< HEAD
import vn.swp391.fa2025.evrental.dto.request.VehicleModelDetailRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.entity.VehicleModel;
=======
import vn.swp391.fa2025.evrental.dto.request.VehicleModelUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f

import java.util.List;

@Service
public interface VehicleModelService {
    public List<VehicleModelResponse> getVihecleModelsByStationWithActiveTariffs(String stationName);
    public VehicleModelResponse getVihecleModelByVehicleModelIdAndStationName(String stationName, Long modelId);
<<<<<<< HEAD
    List<VehicleModelResponse> showAllVehicleModel();
    VehicleModelResponse getVehicleModelById(Long id);
    VehicleModelResponse createVehicleModel(VehicleModelCreateRequest request);
    VehicleModelResponse updateVehicleModel(Long id, VehicleModelUpdateRequest request);

=======

    List<VehicleModelResponse> showAllVehicleModels();

    VehicleModelResponse getVehicleModelById(Long id);

    VehicleModelResponse createVehicleModel(VehicleModelCreateRequest request);

    VehicleModelResponse updateVehicleModel(Long id, VehicleModelUpdateRequest request);

    void deleteVehicleModel(Long id);

>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
}
