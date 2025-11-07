package vn.swp391.fa2025.evrental.mapper;

import jdk.jfr.Name;
import org.mapstruct.*;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = {VehicleMapper.class, TariffMapper.class, StationMapper.class, UserMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface BookingMapper {

    @Mapping(target = "user", qualifiedByName = "toBookingCustomerResponse")
    @Mapping(target = "vehicle", qualifiedByName = "toShortVehicleResponse")
    @Mapping(target = "tariff", qualifiedByName = "toTariffResponse")
    @Mapping(target = "station", source = "vehicle.station", qualifiedByName = "toStationResponse")
    BookingResponse toBookingResponse(Booking booking);

    List<BookingResponse> toBookingResponse(List<Booking> bookings);

    @Named("toEndBookingResponse")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "bookingId", source = "bookingId")
    @Mapping(target = "totalAmount", source = "totalAmount")
    BookingResponse toEndBookingResponse(Booking booking);
}
