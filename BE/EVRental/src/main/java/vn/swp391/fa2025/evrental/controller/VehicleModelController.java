package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.ShowModelByStaionRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelDetailRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
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

    @GetMapping("/showall")
     ApiResponse<List<VehicleModelResponse>> showAllVehicleModel() {
        ApiResponse<List<VehicleModelResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả model xe thành công");
        response.setData(vehicleModelService.showAllVehicleModel());
        response.setCode(200);
        return response;
    }
    @GetMapping("/showbyid/{id}")
    public ApiResponse<VehicleModelResponse> getVehicleModelById(@PathVariable Long id) {
        ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin xe thành công");
        response.setData(vehicleModelService.getVehicleModelById(id));
        response.setCode(200);
        return response;
    }
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<VehicleModelResponse> createVehicleModel(
            @Valid @ModelAttribute VehicleModelCreateRequest request) {
        ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo mẫu xe thành công");
        response.setData(vehicleModelService.createVehicleModel(request));
        response.setCode(201);
        return response;
    }
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<VehicleModelResponse> updateVehicleModel(
            @PathVariable Long id,
            @Valid @ModelAttribute VehicleModelUpdateRequest request) {
        ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật mẫu xe thành công");
        response.setData(vehicleModelService.updateVehicleModel(id, request));
        response.setCode(200);
        return response;
    }
}
