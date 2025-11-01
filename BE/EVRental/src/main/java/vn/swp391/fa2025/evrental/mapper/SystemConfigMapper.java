package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import vn.swp391.fa2025.evrental.dto.response.SystemConfigResponse;
import vn.swp391.fa2025.evrental.entity.SystemConfig;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SystemConfigMapper {

    SystemConfigResponse toDTO(SystemConfig entity);

    List<SystemConfigResponse> toDTOList(List<SystemConfig> entities);
}
