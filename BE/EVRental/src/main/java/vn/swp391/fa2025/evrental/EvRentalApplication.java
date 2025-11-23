package vn.swp391.fa2025.evrental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class EvRentalApplication {

    public static void main(String[] args) {
        SpringApplication.run(EvRentalApplication.class, args);
    }

}
