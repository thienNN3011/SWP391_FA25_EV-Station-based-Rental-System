package vn.swp391.fa2025.evrental.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.entity.*;
import vn.swp391.fa2025.evrental.enums.BookingStatus;
import vn.swp391.fa2025.evrental.enums.ContractStatus;
import vn.swp391.fa2025.evrental.enums.PaymentType;
import vn.swp391.fa2025.evrental.enums.VehicleStatus;
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
    @Transactional
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
                    .status(ContractStatus.fromString("PENDING"))
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
    @Transactional
public String confirmContract(String token) {
    Contract contract = contractRepository.findByToken(token);
    if (contract == null) {
        throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn.");
    }
    if (!"PENDING".equals(contract.getStatus().toString())) {
        throw new RuntimeException("Hợp đồng đã được xác nhận hoặc không hợp lệ.");
    }
    contract.setStatus(ContractStatus.fromString("CONFIRMED"));
    contract.getBooking().setStatus(BookingStatus.fromString("RENTING"));
    contractRepository.save(contract);
    bookingRepository.save(contract.getBooking());

        return """
<style>
  body {
    font-family: 'Segoe UI', Roboto, sans-serif;
    background-color: #f8fafc; /* nền xám rất nhạt */
    color: #333;
    text-align: center;
    padding-top: 100px;
  }
  h2 {
    color: #3b82f6; /* xanh dương nhẹ */
    font-size: 26px;
    margin-bottom: 12px;
  }
  p {
    font-size: 16px;
    color: #555;
  }
</style>

<h2>✅ Hợp đồng đã được xác nhận thành công!</h2>
<p>Bạn có thể quay lại hệ thống để tiếp tục quy trình thuê xe.</p>
""";

}



    @Override
    @Transactional
    public String rejectContract(String token) {
        Contract contract = contractRepository.findByToken(token);
        if (contract == null) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn.");
        }
        if (!contract.getStatus().toString().equals("PENDING")) {
            throw new RuntimeException("Hợp đồng đã được hủy hoặc không hợp lệ.");
        }
        contract.setStatus(ContractStatus.fromString("CANCELLED"));
        Booking booking=contract.getBooking();
        booking.setStatus(BookingStatus.fromString("CANCELLED"));
        bookingRepository.save(booking);
        Payment deposit = paymentRepository.findByBooking_BookingIdAndPaymentType(booking.getBookingId(), PaymentType.fromString("DEPOSIT"));
        int extraRateInt = Integer.parseInt(systemConfigService.getSystemConfigByKey("REFUND").getValue());
        BigDecimal extraRate = BigDecimal.valueOf(extraRateInt).divide(BigDecimal.valueOf(100));
        Payment refund = Payment.builder()
                .booking(booking)
                .transactionDate(LocalDateTime.now())
                .paymentType(PaymentType.fromString("REFUND_DEPOSIT"))
                .amount(deposit.getAmount().multiply(extraRate))
                .referenceCode("REFUND_" + System.currentTimeMillis())
                .build();
        paymentRepository.save(refund);
        Vehicle vehicle=booking.getVehicle();
        vehicle.setStatus(VehicleStatus.fromString("AVAILABLE"));
        vehicleRepository.save(vehicle);
        Tariff tariff = booking.getTariff();
        tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()-1);
        tariffRepository.save(tariff);
        contractRepository.save(contract);
        return """
<style>
  body {
    font-family: 'Segoe UI', Roboto, sans-serif;
    background-color: #f8fafc; /* nền sáng nhạt */
    color: #333;
    text-align: center;
    padding-top: 100px;
  }
  h2 {
    color: #ef4444; /* đỏ nhạt, biểu thị từ chối */
    font-size: 26px;
    margin-bottom: 12px;
  }
  p {
    font-size: 16px;
    color: #555;
  }
</style>

<h2>❌ Hợp đồng đã bị từ chối.</h2>
<p>Nếu bạn cần hỗ trợ, vui lòng liên hệ nhân viên.</p>
""";

    }
}
