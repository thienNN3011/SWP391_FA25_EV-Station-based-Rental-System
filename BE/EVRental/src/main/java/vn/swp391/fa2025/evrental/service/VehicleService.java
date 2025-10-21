package vn.swp391.fa2025.evrental.service;

import vn.swp391.fa2025.evrental.dto.request.VehicleRequest;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import java.util.List;

public interface VehicleService {
   public List<VehicleResponse> showAllVehicle();

  public   VehicleResponse getVehicleById(Long id);

  public   VehicleResponse createVehicle(VehicleRequest.VehicleCreateRequest request);

  public   VehicleResponse updateVehicle(Long id, VehicleRequest.VehicleUpdateRequest request);

   public void deleteVehicle(Long id);
}
