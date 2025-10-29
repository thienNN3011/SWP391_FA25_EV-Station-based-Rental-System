package vn.swp391.fa2025.evrental.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Contract;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.repository.BookingRepository;
import vn.swp391.fa2025.evrental.repository.ContractRepository;
import vn.swp391.fa2025.evrental.repository.UserRepository;
import vn.swp391.fa2025.evrental.util.EmailUtils;

import java.io.IOException;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Contract contract = contractRepository.findByToken(token);
        if (!contract.getBooking().getUser().getUsername().equals(username)) {
            throw new RuntimeException("Bạn không có quyền hủy hợp đồng này.");
        }
        if (contract == null) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn.");
        }
        if (!contract.getStatus().equals("PENDING")) {
            throw new RuntimeException("Hợp đồng đã được hủy hoặc không hợp lệ.");
        }
        contract.setStatus("CANCELLED");
        contract.getBooking().setStatus("CANCELLED");
        contractRepository.save(contract);
        bookingRepository.save(contract.getBooking());
        return """
            <h2>Hợp đồng đã bị từ chối.</h2>
            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ nhân viên.</p>
        """;
    }
}
