package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.entity.Tariff;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TariffMapper {
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "tariffId", source = "tariffId")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "depositAmount", source = "depositAmount")
    TariffResponse toTariffResponse(Tariff tariff);
}
