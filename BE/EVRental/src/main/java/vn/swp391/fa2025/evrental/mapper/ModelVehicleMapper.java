    package vn.swp391.fa2025.evrental.mapper;

    import org.mapstruct.*;
    import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
    import vn.swp391.fa2025.evrental.entity.VehicleModel;

    @Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
    public interface ModelVehicleMapper {
        @BeanMapping(ignoreByDefault = true)
        @Mapping(target = "name", source = "name")
        @Mapping(target = "brand", source = "brand")
        VehicleModelResponse toVehicleModelShortResponse(VehicleModel model);

        @BeanMapping(ignoreByDefault = false)
        @Mapping(target = "modelId", source = "modelId")
        @Mapping(target = "name", source = "name")
        @Mapping(target = "brand", source = "brand")
        @Mapping(target = "batteryCapacity", source = "batteryCapacity")
        @Mapping(target = "range", source = "range")
        @Mapping(target = "seat", source = "seat")
        @Mapping(target = "description", source = "description")
        @Mapping(target = "imageUrls", source = "imageUrls")
        @Mapping(target = "tariffs", source = "tariffs")
        VehicleModelResponse toVehicleModelResponse(VehicleModel model);


    }
