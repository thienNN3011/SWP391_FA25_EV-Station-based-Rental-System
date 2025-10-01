package vn.swp391.fa2025.evrental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.service.VehicleModelService;

import java.util.List;

@RestController
@RequestMapping("/vehiclemodel")
public class VehicleModelController {
    @Autowired
    private VehicleModelService vehicleModelService;

    @GetMapping
    ApiResponse<List<VehicleModelResponse>> getVehicleModelsWithActiveTariffs() {
        ApiResponse<List<VehicleModelResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin các mẫu xe với bảng giá đang hoạt động thành công");
        response.setData(vehicleModelService.getVihecleModelsWithActiveTariffs());
        response.setCode(200);
        return response;
    }
}
