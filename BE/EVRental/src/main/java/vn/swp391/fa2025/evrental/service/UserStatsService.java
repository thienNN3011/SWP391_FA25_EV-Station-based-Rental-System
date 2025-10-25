package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.response.UserStatsResponse;

@Service
public interface UserStatsService {
    UserStatsResponse getCurrentUserStats(String username);
}

