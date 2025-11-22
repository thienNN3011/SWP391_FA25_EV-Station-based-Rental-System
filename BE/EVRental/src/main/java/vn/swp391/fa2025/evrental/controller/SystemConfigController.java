package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.SystemConfigRequest;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.SystemConfigResponse;
import vn.swp391.fa2025.evrental.service.SystemConfigServiceImpl;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@Tag(name = "System Configuration", description = "Cấu hình hệ thống")
@RestController
@RequestMapping("/systemconfig")
public class SystemConfigController {
    @Autowired
    private SystemConfigServiceImpl systemConfigService;

    @Operation(summary = "Xem tất cả cấu hình", description = "Lấy danh sách tất cả cấu hình hệ thống")
    @GetMapping("/showallconfig")
    ApiResponse<List<SystemConfigResponse>> showAllConfig(){
        ApiResponse<List<SystemConfigResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Lấy tất cả system config thành công");
        apiResponse.setData(systemConfigService.getAllSystemConfig());
        apiResponse.setSuccess(true);
        return apiResponse;
    }

    @Operation(summary = "Cập nhật cấu hình", description = "Admin cập nhật giá trị cấu hình hệ thống")
    @PostMapping("/updateconfig")
    ApiResponse<SystemConfigResponse> updateConfig(@Valid @RequestBody SystemConfigRequest request){
        ApiResponse<SystemConfigResponse> apiResponse = new ApiResponse<>();
        SystemConfigResponse systemConfig=systemConfigService.updateSystemConfig(request.getKey(), request.getValue());
        if (systemConfig!=null){
            apiResponse.setCode(200);
            apiResponse.setMessage("Cập nhật thành công config");
            apiResponse.setSuccess(true);
            apiResponse.setData(systemConfig);
        } else {
            apiResponse.setCode(400);
            apiResponse.setData(systemConfigService.getSystemConfigByKeyWithResponse(request.getKey()));
            apiResponse.setMessage("Cập nhật config không thành công");
            apiResponse.setSuccess(false);
        }
        return apiResponse;
    }
}
