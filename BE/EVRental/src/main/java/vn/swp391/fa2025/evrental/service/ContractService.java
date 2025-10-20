package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Contract;
import vn.swp391.fa2025.evrental.entity.User;

@Service
public interface ContractService {
    public Contract saveContractFile(byte[] pdfBytes, Booking booking, User customer, User staff, String token);
    public Contract getContractByToken(String token);
    public String confirmContract(String token);
    public String rejectContract(String token);
}
