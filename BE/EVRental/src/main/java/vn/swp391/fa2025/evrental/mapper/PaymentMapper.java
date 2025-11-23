package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.swp391.fa2025.evrental.dto.response.PaymentResponse;
import vn.swp391.fa2025.evrental.entity.Payment;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "paymentId", ignore = true)
    @Mapping(source = "bookingId", target = "booking.bookingId")
    Payment toEntity(PaymentResponse response);

    @Mapping(source = "booking.bookingId", target = "bookingId")
    PaymentResponse toResponse(Payment entity);
}