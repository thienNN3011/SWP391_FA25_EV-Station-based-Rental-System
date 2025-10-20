package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.*;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = {VehicleMapper.class, TariffMapper.class, StationMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface BookingMapper {

    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "vehicle", qualifiedByName = "toShortVehicleResponse")
    @Mapping(target = "tariff", source = "tariff")
    @Mapping(target = "station", source = "vehicle.station")
    BookingResponse toBookingResponse(Booking booking);

    List<BookingResponse> toBookingResponse(List<Booking> bookings);
}
