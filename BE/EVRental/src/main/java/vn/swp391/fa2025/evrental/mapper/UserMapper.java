package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import vn.swp391.fa2025.evrental.dto.request.RegisterCustomerRequest;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface  UserMapper {

    @Mapping(target = "idCardPhoto", source = "idCardPhotoPath")
    @Mapping(target = "driveLicensePhoto", source = "driveLicensePhotoPath")
    User toEntity(RegisterCustomerRequest req, String idCardPhotoPath, String driveLicensePhotoPath);

    CustomerResponse toDto(User user);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "username", source = "username")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "createdDate", source = "createdDate")
    CustomerResponse toShortResponse(User user);

    //map showall Renters
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "username", source = "username")
    @Mapping(target = "fullName", source = "fullName")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "idCard", source = "idCard")
    @Mapping(target = "driveLicense", source = "driveLicense")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "idCardPhoto", source = "idCardPhoto")
    @Mapping(target = "driveLicensePhoto", source = "driveLicensePhoto")
    RenterListResponse toRenterListResponse(User user);

    //map showall Staffs
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "fullName", source = "fullName")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "idCard", source = "idCard")
    @Mapping(target = "driveLicense", source = "driveLicense")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "idCardPhoto", source = "idCardPhoto")
    @Mapping(target = "driveLicensePhoto", source = "driveLicensePhoto")
    StaffListResponse toStaffListResponse(User user);

    //map updateuser
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "username", source = "username")
    @Mapping(target = "fullName", source = "fullName")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "updatedDate", source = "updatedDate")
    UserUpdateResponse toUpdateResponse(User user);



}