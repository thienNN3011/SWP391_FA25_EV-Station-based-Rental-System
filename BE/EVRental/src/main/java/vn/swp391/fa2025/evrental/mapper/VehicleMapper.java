package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.*;
import org.springframework.context.annotation.Bean;
import vn.swp391.fa2025.evrental.dto.request.VehicleCreateRequest;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.entity.Vehicle;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VehicleMapper {
    //Map show thong tin xe
    @Mapping(target = "vehicleId", source = "vehicleId")
    @Mapping(target = "modelId", source = "model.modelId")
    @Mapping(target = "modelName", source = "model.name")
    @Mapping(target = "brand", source = "model.brand")
    @Mapping(target = "stationId", source = "station.stationId")
    @Mapping(target = "stationName", source = "station.stationName")
    @Mapping(target = "color", source = "color")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "plateNumber", source = "plateNumber")
    VehicleResponse toVehicleResponse(Vehicle vehicle);



    @Named("toShortVehicleResponse")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "plateNumber", source = "plateNumber")
    @Mapping(target = "color", source = "color")
    @Mapping(target = "modelName", source = "model.name")
    @Mapping(target = "brand", source = "model.brand")
    @Mapping(target = "status", source = "status")
    VehicleResponse toShortVehicleResponse(Vehicle vehicle);

    @Mapping(target = "vehicleId", ignore = true)
    @Mapping(target = "model", ignore = true)
    @Mapping(target = "station", ignore = true)
    @Mapping(target = "status", ignore = true) // Sẽ set manual trong service
    @Mapping(target = "color", source = "color")
    @Mapping(target = "plateNumber", source = "plateNumber")
    Vehicle toVehicleFromCreateRequest(VehicleCreateRequest request);

    @IterableMapping(qualifiedByName = "toShortVehicleResponse")
    List<VehicleResponse> toShortVehicleResponseList(List<Vehicle> vehicles);
}
