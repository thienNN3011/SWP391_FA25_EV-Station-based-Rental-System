package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.response.SystemConfigResponse;
import vn.swp391.fa2025.evrental.mapper.SystemConfigMapper;
import vn.swp391.fa2025.evrental.repository.SystemConfigRepository;
import vn.swp391.fa2025.evrental.entity.SystemConfig;

import java.util.List;

@Service
public class SystemConfigServiceImpl implements SystemConfigService{
    @Autowired
    private SystemConfigRepository systemConfigRepository;
    @Autowired
    private SystemConfigMapper systemConfigMapper;

    @Override
    public SystemConfig getSystemConfigByKey(String key) {
        return systemConfigRepository.findByKey(key);
    }

    @Override
    public SystemConfigResponse updateSystemConfig(String key, String value) {
        SystemConfig systemConfig = systemConfigRepository.findByKey(key);
        if (systemConfig==null) throw new RuntimeException("SystemConfig không hợp lệ");
        if (systemConfig.getKey().equals("OVERTIME_EXTRA_RATE") || systemConfig.getKey().equals("REFUND")) {
            try {
                int overtimeExtraRate = Integer.parseInt(value);
                if (overtimeExtraRate < 0) {
                    throw new RuntimeException("Giá trị phải là số dương");
                }
                if (overtimeExtraRate > 100){
                    throw new RuntimeException("Giá trị phải nhỏ hơn hoặc bằng 100");
                }
                systemConfig.setValue(String.valueOf(overtimeExtraRate));
            } catch (NumberFormatException e) {
                throw new RuntimeException("Value phải là số nguyên");
            }
        } else
            if (systemConfig.getKey().equals("QR_EXPIRE") || systemConfig.getKey().equals("CHECK_IN_EXPIRE") || systemConfig.getKey().equals("CANCEL_BOOKING_REFUND_EXPIRE")) {
                try {
                    Integer qrExpire = Integer.parseInt(value);
                    if (qrExpire<=0){
                        throw new RuntimeException("Giá trị phải lớn hơn 0");
                    }
                    systemConfig.setValue(String.valueOf(qrExpire));
                } catch (Exception e){
                    throw new RuntimeException("Value phải là số nguyên");
                }
            }
        SystemConfig newConfig=systemConfigRepository.save(systemConfig);
        if (newConfig==null) return null;
        return systemConfigMapper.toDTO(newConfig);
    }

    @Override
    public List<SystemConfigResponse> getAllSystemConfig() {
        return systemConfigMapper.toDTOList(systemConfigRepository.findAll());
    }

    @Override
    public SystemConfigResponse getSystemConfigByKeyWithResponse(String key) {
        return systemConfigMapper.toDTO(systemConfigRepository.findByKey(key));
    }
}
