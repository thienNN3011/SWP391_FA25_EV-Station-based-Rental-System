package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.ShowVehicleByStatusRequest;
import vn.swp391.fa2025.evrental.dto.request.ShowActiveVehicleByStationRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.ActiveVehicleResponse;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @GetMapping("/showall")
    public ApiResponse<List<VehicleResponse>> showAllVehicle() {
        ApiResponse<List<VehicleResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả xe thành công");
        response.setData(vehicleService.showAllVehicle());
        response.setCode(200);
        return response;
    }

    @GetMapping("/showbyid/{id}")
    public ApiResponse<VehicleResponse> getVehicleById(@PathVariable Long id) {
        ApiResponse<VehicleResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin xe thành công");
        response.setData(vehicleService.getVehicleById(id));
        response.setCode(200);
        return response;
    }

    @PostMapping("/create")
    public ApiResponse<VehicleResponse> createVehicle(
            @Valid @RequestBody VehicleCreateRequest request) {
        ApiResponse<VehicleResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo xe mới thành công");
        response.setData(vehicleService.createVehicle(request));
        response.setCode(201);
        return response;
    }

    @PutMapping("/update/{id}")
    public ApiResponse<VehicleResponse> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleUpdateRequest request) {
        ApiResponse<VehicleResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật thông tin xe thành công");
        response.setData(vehicleService.updateVehicle(id, request));
        response.setCode(200);
        return response;
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteVehicle(@PathVariable Long id) {
        ApiResponse<Void> response = new ApiResponse<>();
        vehicleService.deleteVehicle(id);
        response.setSuccess(true);
        response.setMessage("Xóa xe thành công");
        response.setCode(200);
        return response;
    }

    @PostMapping("/showbystatus")
    public ApiResponse<List<VehicleResponse>> showAllVehicleByStatus(@Valid @RequestBody ShowVehicleByStatusRequest request) {
        ApiResponse<List<VehicleResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy xe theo status thành công");
        response.setData(vehicleService.showByStatus(request.getStatus()));
        response.setCode(200);
        return response;
    }
    
    @PostMapping("/showactivebystation")
    public ApiResponse<List<ActiveVehicleResponse>> showActiveVehiclesByStation(
            @RequestBody ShowActiveVehicleByStationRequest request) {
        ApiResponse<List<ActiveVehicleResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin các xe đang hoạt động của trạm thành công");
        response.setData(vehicleService.getActiveVehiclesByStation(request.getStationName()));
        response.setCode(200);
        return response;
    }
}