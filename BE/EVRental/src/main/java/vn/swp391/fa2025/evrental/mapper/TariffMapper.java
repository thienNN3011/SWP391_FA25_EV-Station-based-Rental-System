package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.*;
import vn.swp391.fa2025.evrental.dto.request.TariffCreateRequest;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffUpdateResponse;
import vn.swp391.fa2025.evrental.entity.Tariff;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TariffMapper {
    @Named("toTariffResponse")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "tariffId", source = "tariffId")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "depositAmount", source = "depositAmount")
    TariffResponse toTariffResponse(Tariff tariff);

<<<<<<< HEAD
    @Mapping(target = "tariffId", source = "tariffId")
    @Mapping(target = "modelId", source = "model.modelId")
    @Mapping(target = "modelName", source = "model.name")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "depositAmount", source = "depositAmount")
    @Mapping(target = "status", source = "status")
    TariffUpdateResponse toTariffUpdateResponse(Tariff tariff);
=======
    @Mapping(target = "tariffId", ignore = true)
    @Mapping(target = "model", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    @Mapping(target = "type", source = "type")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "numberOfContractAppling", source = "numberOfContractAppling")
    @Mapping(target = "depositAmount", source = "depositAmount")
    @Mapping(target = "status", source = "status")
    Tariff toTariffFromCreateRequest(TariffCreateRequest request);
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
}

