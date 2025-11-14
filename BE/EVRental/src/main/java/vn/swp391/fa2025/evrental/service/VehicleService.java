package vn.swp391.fa2025.evrental.service;

import vn.swp391.fa2025.evrental.dto.request.VehicleCreateRequest;

import vn.swp391.fa2025.evrental.dto.request.VehicleUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.ActiveVehicleResponse;
import vn.swp391.fa2025.evrental.dto.response.ChangeVehicleStationResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import java.util.List;

public interface VehicleService {
    List<VehicleResponse> showAllVehicle();

    VehicleResponse getVehicleById(Long id);

    VehicleResponse createVehicle(VehicleCreateRequest request);

    VehicleResponse updateVehicle(Long id, VehicleUpdateRequest request);

    void deleteVehicle(Long id);

    List<VehicleResponse> showByStatus(String status);
    List<ActiveVehicleResponse> getActiveVehiclesByStation(String stationName);

    void changeVehicleStation(Long vehicleId, String stationName);

    ChangeVehicleStationResponse showVehicleInStation(String stationName, Long modelId);

    List<VehicleResponse> getVehicleToUpdate(Long bookingId);
}
