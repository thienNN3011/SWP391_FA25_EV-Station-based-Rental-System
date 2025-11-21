package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.*;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.dto.response.StationShowAllResponse;
import vn.swp391.fa2025.evrental.dto.response.StationUpdateResponse;
import vn.swp391.fa2025.evrental.entity.Station;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)

public interface StationMapper {
    @Named("toStationResponse")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "stationName", source = "stationName")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "openingHours", source = "openingHours")
    StationResponse toStationResponse(Station station);

    List<StationResponse> toStationResponseList(List<Station> stations);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "stationName", source = "stationName")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "openingHours", source = "openingHours")
    @Mapping(target = "status",source ="status")
    List<StationShowAllResponse> toStationShowAllResponses(List<Station> stations);


    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "stationName", source = "stationName")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "openingHours", source = "openingHours")
    @Mapping(target = "status",source ="status")
    StationUpdateResponse toStationUpdateResponse(Station station);
}
