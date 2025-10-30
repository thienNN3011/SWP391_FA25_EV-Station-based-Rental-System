package vn.swp391.fa2025.evrental.service;

import vn.swp391.fa2025.evrental.dto.response.SystemConfigResponse;
import vn.swp391.fa2025.evrental.entity.SystemConfig;

import java.util.List;

public interface SystemConfigService {
    SystemConfig getSystemConfigByKey(String key);
    SystemConfigResponse updateSystemConfig(String key, String value);
    List<SystemConfigResponse> getAllSystemConfig();
    SystemConfigResponse getSystemConfigByKeyWithResponse(String key);
}
