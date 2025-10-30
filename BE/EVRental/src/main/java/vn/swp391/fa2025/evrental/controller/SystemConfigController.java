package vn.swp391.fa2025.evrental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.SystemConfigRequest;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.SystemConfigResponse;
import vn.swp391.fa2025.evrental.service.SystemConfigServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/systemconfig")
public class SystemConfigController {
    @Autowired
    private SystemConfigServiceImpl systemConfigService;

    @GetMapping("/showallconfig")
    ApiResponse<List<SystemConfigResponse>> showAllConfig(){
        ApiResponse<List<SystemConfigResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Lấy tất cả system config thành công");
        apiResponse.setData(systemConfigService.getAllSystemConfig());
        apiResponse.setSuccess(true);
        return apiResponse;
    }

    @PostMapping("/updateconfig")
    ApiResponse<SystemConfigResponse> updateConfig(@RequestBody SystemConfigRequest request){
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
