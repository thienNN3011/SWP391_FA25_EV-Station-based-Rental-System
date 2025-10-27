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
<<<<<<< HEAD

    @GetMapping("/showall")
     ApiResponse<List<VehicleModelResponse>> showAllVehicleModel() {
        ApiResponse<List<VehicleModelResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả model xe thành công");
        response.setData(vehicleModelService.showAllVehicleModel());
        response.setCode(200);
        return response;
    }
=======
    @GetMapping("/showall")
    public ApiResponse<List<VehicleModelResponse>> showAllVehicleModels() {
        ApiResponse<List<VehicleModelResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả mẫu xe thành công");
        response.setData(vehicleModelService.showAllVehicleModels());
        response.setCode(200);
        return response;
    }

>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
    @GetMapping("/showbyid/{id}")
    public ApiResponse<VehicleModelResponse> getVehicleModelById(@PathVariable Long id) {
        ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
        response.setSuccess(true);
<<<<<<< HEAD
        response.setMessage("Lấy thông tin xe thành công");
=======
        response.setMessage("Lấy thông tin mẫu xe thành công");
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        response.setData(vehicleModelService.getVehicleModelById(id));
        response.setCode(200);
        return response;
    }
<<<<<<< HEAD
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<VehicleModelResponse> createVehicleModel(
            @Valid @ModelAttribute VehicleModelCreateRequest request) {
        ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo mẫu xe thành công");
=======

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<VehicleModelResponse> createVehicleModel(
            @ModelAttribute VehicleModelCreateRequest request) {

        ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo mẫu xe mới thành công");
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        response.setData(vehicleModelService.createVehicleModel(request));
        response.setCode(201);
        return response;
    }
<<<<<<< HEAD
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<VehicleModelResponse> updateVehicleModel(
            @PathVariable Long id,
            @Valid @ModelAttribute VehicleModelUpdateRequest request) {
        ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật mẫu xe thành công");
=======

    @PutMapping("/update/{id}")
    public ApiResponse<VehicleModelResponse> updateVehicleModel(
            @PathVariable Long id,
            @Valid @RequestBody VehicleModelUpdateRequest request) {
        ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật thông tin mẫu xe thành công");
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        response.setData(vehicleModelService.updateVehicleModel(id, request));
        response.setCode(200);
        return response;
    }
<<<<<<< HEAD
=======

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteVehicleModel(@PathVariable Long id) {
        ApiResponse<Void> response = new ApiResponse<>();
        vehicleModelService.deleteVehicleModel(id);
        response.setSuccess(true);
        response.setMessage("Xóa mẫu xe thành công");
        response.setCode(200);
        return response;
    }
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
}
