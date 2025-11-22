# Swagger Annotations Guide for EVRental Project

## Quick Reference - Common Annotations

### 1. Controller Level Annotations

```java
@Tag(name = "Controller Name", description = "Description of what this controller does")
@RestController
@RequestMapping("/path")
public class YourController {
    // ...
}
```

### 2. Endpoint Level Annotations

#### Basic GET Endpoint
```java
@Operation(
    summary = "Short description",
    description = "Detailed description with markdown support",
    security = @SecurityRequirement(name = "Bearer Authentication") // If requires auth
)
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "200",
        description = "Success message",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = YourResponse.class)
        )
    ),
    @ApiResponse(responseCode = "404", description = "Not found")
})
@GetMapping("/endpoint")
public ApiResponse<YourResponse> yourMethod(
    @Parameter(description = "Parameter description") @PathVariable Long id
) {
    // implementation
}
```

#### POST Endpoint with Request Body
```java
@Operation(summary = "Create something", security = @SecurityRequirement(name = "Bearer Authentication"))
@ApiResponses(value = {
    @ApiResponse(responseCode = "201", description = "Created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid input")
})
@PostMapping("/create")
public ApiResponse<YourResponse> create(
    @Parameter(description = "Request data") @Valid @RequestBody YourRequest request
) {
    // implementation
}
```

## Controllers Documentation Status

### ✅ Completed
1. **AuthController** - Full documentation with examples
2. **SwaggerConfig** - Configuration complete
3. **SecurityConfig** - Updated to allow Swagger endpoints

### 🔄 To Be Completed
Apply the following pattern to each controller:

#### BookingController
- Tag: "Booking Management"
- Key endpoints: createbooking, startrental, endrental, confirm, reject
- All require authentication except confirm/reject (token-based)

#### UserController  
- Tag: "User Management"
- Key endpoints: register, verify-otp, profile, upload documents
- Mix of public (register) and authenticated endpoints

#### VehicleController
- Tag: "Vehicle Management"
- Key endpoints: CRUD operations for vehicles
- Public: showall, showbyid
- Admin only: create, update, delete

#### VehicleModelController
- Tag: "Vehicle Model Management"
- Key endpoints: CRUD for models, image management
- Public: showall, showbyid
- Admin only: create, update, delete, image operations

#### StationController
- Tag: "Station Management"
- Key endpoints: CRUD for stations, statistics
- Public: showactivestation
- Admin/Staff: create, update, delete, stats

#### TariffController
- Tag: "Tariff Management"
- Key endpoints: CRUD for pricing
- Public: showall, showbyid
- Admin only: create, update, delete

#### PaymentController
- Tag: "Payment Management"
- Key endpoints: VNPay integration, revenue stats, refund
- Public: vnpay-return (callback)
- Admin: revenue, refund

#### IncidentReportController
- Tag: "Incident Report Management"
- Key endpoints: CRUD for incident reports
- Staff/Admin: create, update
- Public/Admin: view reports

#### SystemConfigController
- Tag: "System Configuration"
- Key endpoints: view and update system configs
- Admin only: all endpoints

## Quick Implementation Steps

For each controller:

1. Add imports at the top:
```java
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
```

2. Add @Tag annotation to class

3. Add @Operation to each endpoint method

4. Add @ApiResponses for different response codes

5. Add @Parameter to method parameters

6. Add @SecurityRequirement for protected endpoints

## Testing Swagger UI

After implementation:

1. Start the application
2. Navigate to: `http://localhost:8080/EVRental/swagger-ui.html`
3. Test authentication:
   - Call `/auth/login` endpoint
   - Copy the JWT token from response
   - Click "Authorize" button at top right
   - Enter: `Bearer <your-token>`
   - Click "Authorize"
4. Test protected endpoints
5. Verify all endpoints are documented correctly

## Common Response Codes

- **200**: Success (GET, PUT, DELETE)
- **201**: Created (POST)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

## Security Requirements

- **Public endpoints**: No @SecurityRequirement needed
- **Authenticated endpoints**: Add `security = @SecurityRequirement(name = "Bearer Authentication")`
- **Role-based endpoints**: Document required roles in description

## Next Steps

1. Complete BookingController (highest priority - core business logic)
2. Complete UserController (user management)
3. Complete Vehicle & VehicleModel controllers (inventory)
4. Complete Payment & Tariff controllers (pricing)
5. Complete remaining controllers
6. Add @Schema annotations to DTOs for better documentation
7. Test all endpoints via Swagger UI
8. Review and refine documentation

