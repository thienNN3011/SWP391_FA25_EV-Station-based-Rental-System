package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import vn.swp391.fa2025.evrental.dto.request.RegisterCustomerRequest;
import vn.swp391.fa2025.evrental.dto.response.CustomerResponse;
import vn.swp391.fa2025.evrental.entity.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "idCardPhoto", source = "idCardPhotoPath")
    @Mapping(target = "driveLicensePhoto", source = "driveLicensePhotoPath")
    User toEntity(RegisterCustomerRequest req, String idCardPhotoPath, String driveLicensePhotoPath);

    CustomerResponse toDto(User user);
}

