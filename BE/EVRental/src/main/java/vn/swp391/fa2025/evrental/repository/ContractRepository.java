package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.Contract;

@Repository
public interface ContractRepository extends JpaRepository<Contract,Long> {
    public Contract findByToken(String token);
    Contract findByBooking_BookingId(Long bookingId);
}
