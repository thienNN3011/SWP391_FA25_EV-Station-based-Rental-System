package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.*;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.dto.request.StationCreateRequest;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)

public interface StationMapper {
    @Named("toStationResponse")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "stationName", source = "stationName")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "openingHours", source = "openingHours")
    StationResponse toStationResponse(Station station);

    @Mapping(target = "stationId", ignore = true)
    @Mapping(target = "users", ignore = true)
    @Mapping(target = "vehicles", ignore = true)
    @Mapping(target = "stationName", source = "stationName")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "openingHours", source = "openingHours")
    @Mapping(target = "status", source = "status")
    Station toStationFromCreateRequest(StationCreateRequest request);

    default Integer getTotalVehicles(Station station) {
        return station.getVehicles() != null ? station.getVehicles().size() : 0;
    }

    default Integer getTotalStaffs(Station station) {
        return station.getUsers() != null ? station.getUsers().size() : 0;
    }
}
