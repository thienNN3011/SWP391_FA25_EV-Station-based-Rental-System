package vn.swp391.fa2025.evrental.service;

import vn.swp391.fa2025.evrental.dto.request.VehicleRequest;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import java.util.List;

public interface VehicleService {
    List<VehicleResponse> showAllVehicle();

    VehicleResponse getVehicleById(Long id);

    VehicleResponse createVehicle(VehicleRequest.VehicleCreateRequest request);

    VehicleResponse updateVehicle(Long id, VehicleRequest.VehicleUpdateRequest request);

    void deleteVehicle(Long id);
}
