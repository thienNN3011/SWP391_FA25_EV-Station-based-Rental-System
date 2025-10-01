package vn.swp391.fa2025.evrental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    ApiResponse<List<Vehicle>> showAllVehicle() {
        ApiResponse<List<Vehicle>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lay thong tin tat ca xe thanh cong");
        response.setData(vehicleService.showAllVehicle());
        response.setCode(200);
        return response;
    }
}
