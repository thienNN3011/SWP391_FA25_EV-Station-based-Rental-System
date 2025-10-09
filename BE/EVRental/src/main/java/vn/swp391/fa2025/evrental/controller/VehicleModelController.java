package vn.swp391.fa2025.evrental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.ShowModelByStaionRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelDetailRequest;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.service.VehicleModelService;

import java.util.List;

@RestController
@RequestMapping("/vehiclemodel")
public class VehicleModelController {
    @Autowired
    private VehicleModelService vehicleModelService;

    @PostMapping
    ApiResponse<List<VehicleModelResponse>> getVehicleModelsByStationWithActiveTariffs(@RequestBody ShowModelByStaionRequest request) {
        ApiResponse<List<VehicleModelResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin các mẫu xe với bảng giá đang hoạt động của trạm thành công");
        response.setData(vehicleModelService.getVihecleModelsByStationWithActiveTariffs(request.getStationName()));
        response.setCode(200);
        return response;
    }

    @PostMapping("/getvehicelmodeldetail")
    ApiResponse<VehicleModelResponse> getVehicleModelDetailByModelIdAndStation(@RequestBody VehicleModelDetailRequest request){
        ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin của mẫu xe thành công");
        response.setData(vehicleModelService.getVihecleModelByVehicleModelIdAndStationName(request.getStationName(), request.getModelId()));
        response.setCode(200);
        return response;
    }
}
