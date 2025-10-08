package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)

public interface StationMapper {
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "stationName", source = "stationName")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "openingHours", source = "openingHours")
    StationResponse toStationResponse(StationResponse station);
}
