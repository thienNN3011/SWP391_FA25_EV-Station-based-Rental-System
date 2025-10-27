package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.*;
import vn.swp391.fa2025.evrental.dto.response.ModelImageUrlResponse;
import vn.swp391.fa2025.evrental.entity.ModelImageUrl;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ModelImageUrlMapper {

    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "color", source = "color")
    ModelImageUrlResponse toResponse(ModelImageUrl entity);

    List<ModelImageUrlResponse> toResponseList(List<ModelImageUrl> entities);
}