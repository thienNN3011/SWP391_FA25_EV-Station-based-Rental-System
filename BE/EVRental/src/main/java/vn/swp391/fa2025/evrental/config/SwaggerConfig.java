package vn.swp391.fa2025.evrental.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Swagger/OpenAPI Configuration for EVRental API Documentation
 * 
 * This configuration provides:
 * - Interactive API documentation via Swagger UI
 * - JWT Bearer token authentication support
 * - Comprehensive API information and metadata
 * 
 * Access Swagger UI at: http://localhost:8080/EVRental/swagger-ui.html
 * Access API Docs JSON at: http://localhost:8080/EVRental/v3/api-docs
 */
@Configuration
public class SwaggerConfig {

    @Value("${server.servlet.context-path:/}")
    private String contextPath;

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        // Define JWT Security Scheme
        final String securitySchemeName = "Bearer Authentication";
        
        return new OpenAPI()
                // API Information
                .info(new Info()
                        .title("EVRental API")
                        .description("API hệ thống thuê xe điện. Sử dụng JWT Bearer Token.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("EVRental Team")
                                .email("evrentalswp391fa2025@gmail.com")))
                
                // Server Configuration
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort + contextPath)
                                .description("Local Development Server"),
                        new Server()
                                .url("https://api.evrental.com" + contextPath)
                                .description("Production Server (if available)")
                ))
                
                // Security Configuration
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Sử dụng JWT token từ /auth/login. Token hết hạn sau 24 giờ.")));
    }

    /**
     * Group: All APIs
     * Hiển thị tất cả endpoints
     */
    @Bean
    public GroupedOpenApi allApis() {
        return GroupedOpenApi.builder()
                .group("1. Tất cả APIs")
                .pathsToMatch("/**")
                .build();
    }

    /**
     * Group: Authentication & Authorization
     * Các API liên quan đến xác thực và phân quyền
     */
    @Bean
    public GroupedOpenApi authApis() {
        return GroupedOpenApi.builder()
                .group("2. Xác thực")
                .pathsToMatch("/auth/**")
                .build();
    }

    /**
     * Group: User Management
     * Quản lý người dùng
     */
    @Bean
    public GroupedOpenApi userApis() {
        return GroupedOpenApi.builder()
                .group("3. Quản lý người dùng")
                .pathsToMatch("/users/**")
                .build();
    }

    /**
     * Group: Booking Management
     * Quản lý đặt xe
     */
    @Bean
    public GroupedOpenApi bookingApis() {
        return GroupedOpenApi.builder()
                .group("4. Quản lý booking")
                .pathsToMatch("/bookings/**")
                .build();
    }

    /**
     * Group: Vehicle Management
     * Quản lý xe và mẫu xe
     */
    @Bean
    public GroupedOpenApi vehicleApis() {
        return GroupedOpenApi.builder()
                .group("5. Quản lý xe")
                .pathsToMatch("/vehicles/**", "/vehiclemodels/**")
                .build();
    }

    /**
     * Group: Station Management
     * Quản lý trạm
     */
    @Bean
    public GroupedOpenApi stationApis() {
        return GroupedOpenApi.builder()
                .group("6. Quản lý trạm")
                .pathsToMatch("/stations/**")
                .build();
    }

    /**
     * Group: Payment & Tariff
     * Thanh toán và bảng giá
     */
    @Bean
    public GroupedOpenApi paymentApis() {
        return GroupedOpenApi.builder()
                .group("7. Thanh toán & Bảng giá")
                .pathsToMatch("/payments/**", "/tariffs/**")
                .build();
    }

    /**
     * Group: Incident Reports
     * Báo cáo sự cố
     */
    @Bean
    public GroupedOpenApi incidentApis() {
        return GroupedOpenApi.builder()
                .group("8. Báo cáo sự cố")
                .pathsToMatch("/incidentreport/**")
                .build();
    }

    /**
     * Group: System Configuration
     * Cấu hình hệ thống
     */
    @Bean
    public GroupedOpenApi systemApis() {
        return GroupedOpenApi.builder()
                .group("9. Cấu hình hệ thống")
                .pathsToMatch("/systemconfig/**")
                .build();
    }
}

