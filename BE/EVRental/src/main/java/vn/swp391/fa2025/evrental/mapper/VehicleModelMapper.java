package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelCreateRequest;
import vn.swp391.fa2025.evrental.dto.response.ModelImageUrlResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.entity.ModelImageUrl;
import vn.swp391.fa2025.evrental.entity.VehicleModel;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VehicleModelMapper {
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "brand", source = "brand")
    VehicleModelResponse toVehicleModelShortResponse(VehicleModel model);


    @Mapping(target = "modelId", source = "modelId")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "brand", source = "brand")
    @Mapping(target = "batteryCapacity", source = "batteryCapacity")
    @Mapping(target = "range", source = "range")
    @Mapping(target = "seat", source = "seat")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "imageUrl", source = "imageUrls")
    @Mapping(target = "colors", expression = "java(extractColors(vehicleModel))")
    @Mapping(target = "tariffs", ignore = true)
    @Mapping(target = "stationName", ignore = true)
    VehicleModelResponse toVehicleModelResponse(VehicleModel vehicleModel);

    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "color", source = "color")
    ModelImageUrlResponse toModelImageUrlResponse(ModelImageUrl modelImageUrl);

    default List<ModelImageUrlResponse> mapImageUrls(List<ModelImageUrl> imageUrls) {
        if (imageUrls == null) {
            return null;
        }
        return imageUrls.stream().map(this::toModelImageUrlResponse).collect(Collectors.toList());
    }

    default Set<String> extractColors(VehicleModel vehicleModel) {
        if (vehicleModel.getImageUrls() == null) {
            return null;
        }
        return vehicleModel.getImageUrls().stream().map(ModelImageUrl::getColor).collect(Collectors.toSet());
    }

    @Mapping(target = "modelId", ignore = true)
    @Mapping(target = "imageUrls", ignore = true)
    @Mapping(target = "vehicles", ignore = true)
    @Mapping(target = "tariffs", ignore = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "brand", source = "brand")
    @Mapping(target = "batteryCapacity", source = "batteryCapacity")
    @Mapping(target = "range", source = "range")
    @Mapping(target = "seat", source = "seat")
    @Mapping(target = "description", source = "description")
    VehicleModel toVehicleModelFromCreateRequest(VehicleModelCreateRequest request);
}
