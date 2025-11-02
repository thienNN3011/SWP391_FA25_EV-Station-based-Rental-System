package vn.swp391.fa2025.evrental.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.entity.*;
import vn.swp391.fa2025.evrental.repository.*;
import vn.swp391.fa2025.evrental.util.EmailUtils;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private EmailUtils emailUtils;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private TariffRepository tariffRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private SystemConfigServiceImpl systemConfigService;

    @Value("${app.contracts.path:contracts}")
    private String contractsFolder;

    @Override
    public Contract saveContractFile(byte[] pdfBytes, Booking booking, User customer, User staff, String token) {
        try {
            String fileName = "Contract_" + booking.getBookingId() + ".pdf";
            Path folderPath = Paths.get(contractsFolder);
            Files.createDirectories(folderPath);
            Path filePath = folderPath.resolve(fileName);
            Files.write(filePath, pdfBytes, StandardOpenOption.CREATE);
            Contract contract = Contract.builder()
                    .booking(booking)
                    .user(customer)
                    .staff(staff)
                    .contractUrl(filePath.toAbsolutePath().toString())
                    .status("PENDING")
                    .token(token)
                    .build();
            return contractRepository.save(contract);

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file hợp đồng: " + e.getMessage(), e);
        }
    }

    @Override
    public Contract getContractByToken(String token) {
        return contractRepository.findByToken(token);
    }

    @Override
public String confirmContract(String token) {
    Contract contract = contractRepository.findByToken(token);
    if (contract == null) {
        throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn.");
    }
    if (!"PENDING".equals(contract.getStatus())) {
        throw new RuntimeException("Hợp đồng đã được xác nhận hoặc không hợp lệ.");
    }
    contract.setStatus("CONFIRMED");
    contract.getBooking().setStatus("RENTING");
    contractRepository.save(contract);
    bookingRepository.save(contract.getBooking());

    return """
    <h2>Hợp đồng đã được xác nhận thành công!</h2>
    <p>Bạn có thể quay lại hệ thống để tiếp tục quy trình thuê xe.</p>
    """;
}



    @Override
    public String rejectContract(String token) {
        Contract contract = contractRepository.findByToken(token);
        if (contract == null) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn.");
        }
        if (!contract.getStatus().equals("PENDING")) {
            throw new RuntimeException("Hợp đồng đã được hủy hoặc không hợp lệ.");
        }
        contract.setStatus("CANCELLED");
        Booking booking=contract.getBooking();
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        Payment deposit = paymentRepository.findByBooking_BookingIdAndPaymentType(booking.getBookingId(), "DEPOSIT");
        int extraRateInt = Integer.parseInt(systemConfigService.getSystemConfigByKey("REFUND").getValue());
        BigDecimal extraRate = BigDecimal.valueOf(extraRateInt).divide(BigDecimal.valueOf(100));
        Payment refund = Payment.builder()
                .booking(booking)
                .transactionDate(LocalDateTime.now())
                .paymentType("REFUND_DEPOSIT")
                .amount(deposit.getAmount().multiply(extraRate))
                .referenceCode("REFUND_" + System.currentTimeMillis())
                .build();
        paymentRepository.save(refund);
        Vehicle vehicle=booking.getVehicle();
        vehicle.setStatus("AVAILABLE");
        vehicleRepository.save(vehicle);
        Tariff tariff = booking.getTariff();
        tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()-1);
        tariffRepository.save(tariff);
        contractRepository.save(contract);
        return """
            <h2>Hợp đồng đã bị từ chối.</h2>
            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ nhân viên.</p>
        """;
    }
}
