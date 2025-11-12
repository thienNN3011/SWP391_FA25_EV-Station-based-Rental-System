package vn.swp391.fa2025.evrental.service;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.response.AfterBookingResponse;
import vn.swp391.fa2025.evrental.dto.response.BookingResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.entity.*;
import vn.swp391.fa2025.evrental.enums.StationStatus;
import vn.swp391.fa2025.evrental.enums.TariffStatus;
import vn.swp391.fa2025.evrental.enums.VehicleStatus;
import vn.swp391.fa2025.evrental.mapper.BookingMapper;
import vn.swp391.fa2025.evrental.repository.*;
import vn.swp391.fa2025.evrental.util.EmailUtils;
import vn.swp391.fa2025.evrental.util.QrUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingConcurrencyTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private TariffRepository tariffRepository;

    @Mock
    private StationRepository stationRepository;

    @Mock
    private ContractGeneratorService contractGeneratorService;

    @Mock
    private BookingMapper bookingMapper;

    @Mock
    private ContractServiceImpl contractService;

    @Mock
    private EmailUtils emailUtils;

    @Mock
    private VnPayService vnPayService;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private SystemConfigServiceImpl systemConfigService;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private Station testStation;
    private VehicleModel testModel;
    private Tariff testTariff;
    private List<Vehicle> availableVehicles;

    @BeforeEach
    void setUp() {
        // Setup test station
        testStation = new Station();
        testStation.setStationId(1L);
        testStation.setStationName("Test Station");
        testStation.setAddress("Test Address");
        testStation.setOpeningHours("24/7");
        testStation.setStatus(StationStatus.OPEN);

        // Setup test model
        testModel = new VehicleModel();
        testModel.setModelId(1L);
        testModel.setName("VinFast VF8");
        testModel.setBrand("VinFast");

        // Setup test tariff
        testTariff = new Tariff();
        testTariff.setTariffId(1L);
        testTariff.setType("DAILY");
        testTariff.setPrice(new BigDecimal("500000"));
        testTariff.setDepositAmount(new BigDecimal("2000000"));
        testTariff.setStatus(TariffStatus.ACTIVE);
        testTariff.setNumberOfContractAppling(0L);
        testTariff.setModel(testModel);

        // Create 5 available vehicles
        availableVehicles = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            Vehicle vehicle = new Vehicle();
            vehicle.setVehicleId((long) i);
            vehicle.setPlateNumber("29A-" + String.format("%04d", i));
            vehicle.setColor("White");
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicle.setModel(testModel);
            vehicle.setStation(testStation);
            availableVehicles.add(vehicle);
        }
    }
    @Test
    void testConcurrentBooking_WithEnoughOrExcessVehicles_ShouldAllSucceed() throws Exception {
        // Arrange
        int numberOfUsers = 5;
        int availableCount = 5; // có nhiều xe hơn số user

        List<Vehicle> enoughVehicles = availableVehicles.subList(0, availableCount);
        Queue<Vehicle> vehicleQueue = new ConcurrentLinkedQueue<>(enoughVehicles);

        when(stationRepository.findByStationName("Test Station")).thenReturn(testStation);
        when(tariffRepository.findById(1L)).thenReturn(Optional.of(testTariff));
        when(tariffRepository.findByTariffIdAndModel_ModelId(1L, 1L)).thenReturn(testTariff);

        when(vehicleRepository.findOneAvailableVehicleForUpdate(anyLong(), anyLong(), anyString()))
                .thenAnswer(invocation -> {
                    Vehicle v = vehicleQueue.poll();
                    return v != null ? Optional.of(v) : Optional.empty();
                });

        // ✅ Dynamic mock userRepository
        when(userRepository.findByUsername(anyString())).thenAnswer(invocation -> {
            String username = invocation.getArgument(0);
            return createTestUser(username);
        });

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setBookingId((long) (Math.random() * 10000));
            return b;
        });
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(tariffRepository.save(any(Tariff.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ExecutorService executor = Executors.newFixedThreadPool(numberOfUsers);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch endLatch = new CountDownLatch(numberOfUsers);
        Set<String> assignedPlates = Collections.synchronizedSet(new HashSet<>());
        List<Exception> exceptions = Collections.synchronizedList(new ArrayList<>());
        List<Future<BookingResult>> futures = new ArrayList<>();

        try (MockedStatic<QrUtils> qrUtilsMock = mockStatic(QrUtils.class)) {
            qrUtilsMock.when(() -> QrUtils.generateQrBase64(anyString())).thenReturn("base64QrCode");
            when(vnPayService.createPaymentUrl(any(), any(), anyString(), anyLong())).thenReturn("http://payment.url");

            for (int i = 0; i < numberOfUsers; i++) {
                final String username = "user" + (i + 1);
                Future<BookingResult> future = executor.submit(() -> {
                    try {
                        startLatch.await();
                        setupSecurityContext(username);
                        BookingRequest request = createBookingRequest();
                        AfterBookingResponse response = bookingService.bookVehicle(httpServletRequest, request);
                        String plate = response.getBookingResponse().getVehicle().getPlateNumber();
                        boolean unique = assignedPlates.add(plate);
                        return new BookingResult(username, plate, unique, null);
                    } catch (Exception e) {
                        exceptions.add(e);
                        return new BookingResult(username, null, false, e);
                    } finally {
                        endLatch.countDown();
                    }
                });
                futures.add(future);
            }

            startLatch.countDown();
            boolean completed = endLatch.await(10, TimeUnit.SECONDS);
            assertTrue(completed, "All threads complete");

            executor.shutdown();

            List<BookingResult> results = new ArrayList<>();
            for (Future<BookingResult> f : futures) results.add(f.get());

            System.out.println("=== Enough Vehicle Test Results ===");
            results.forEach(r -> {
                if (r.exception != null)
                    System.out.println(r.username + " - FAILED: " + r.exception.getMessage());
                else
                    System.out.println(r.username + " - SUCCESS: " + r.plateNumber);
            });

            long successCount = results.stream().filter(r -> r.exception == null).count();
            assertEquals(numberOfUsers, successCount,
                    "Tất cả người dùng đều phải thuê thành công vì đủ (hoặc dư) xe");

            long failCount = results.stream().filter(r -> r.exception != null).count();
            assertEquals(0, failCount, "Không user nào được phép fail");

            assertEquals(numberOfUsers, assignedPlates.size(), "Mỗi user phải được gán biển số duy nhất");

            verify(vehicleRepository, atLeast(numberOfUsers)).save(any(Vehicle.class));
        }
    }


    @Test
    void testConcurrentBooking_WithInsufficientVehicles_ShouldFailForSomeUsers() throws Exception {
        // Arrange
        int numberOfUsers = 5;
        int availableCount = 3;

        List<Vehicle> limitedVehicles = availableVehicles.subList(0, availableCount);
        Queue<Vehicle> vehicleQueue = new ConcurrentLinkedQueue<>(limitedVehicles);

        when(stationRepository.findByStationName("Test Station")).thenReturn(testStation);
        when(tariffRepository.findById(1L)).thenReturn(Optional.of(testTariff));
        when(tariffRepository.findByTariffIdAndModel_ModelId(1L, 1L)).thenReturn(testTariff);
        when(vehicleRepository.findOneAvailableVehicleForUpdate(anyLong(), anyLong(), anyString()))
                .thenAnswer(invocation -> {
                    Vehicle v = vehicleQueue.poll();
                    return v != null ? Optional.of(v) : Optional.empty();
                });

        // ✅ Dynamic mock userRepository
        when(userRepository.findByUsername(anyString())).thenAnswer(invocation -> {
            String username = invocation.getArgument(0);
            return createTestUser(username);
        });

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setBookingId((long) (Math.random() * 10000));
            return b;
        });
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(tariffRepository.save(any(Tariff.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ExecutorService executor = Executors.newFixedThreadPool(numberOfUsers);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch endLatch = new CountDownLatch(numberOfUsers);
        Set<String> assignedPlates = Collections.synchronizedSet(new HashSet<>());
        List<Exception> exceptions = Collections.synchronizedList(new ArrayList<>());
        List<Future<BookingResult>> futures = new ArrayList<>();

        try (MockedStatic<QrUtils> qrUtilsMock = mockStatic(QrUtils.class)) {
            qrUtilsMock.when(() -> QrUtils.generateQrBase64(anyString())).thenReturn("base64QrCode");
            when(vnPayService.createPaymentUrl(any(), any(), anyString(), anyLong())).thenReturn("http://payment.url");

            for (int i = 0; i < numberOfUsers; i++) {
                final String username = "user" + (i + 1);
                Future<BookingResult> future = executor.submit(() -> {
                    try {
                        startLatch.await();
                        setupSecurityContext(username);
                        BookingRequest request = createBookingRequest();
                        AfterBookingResponse response = bookingService.bookVehicle(httpServletRequest, request);
                        String plate = response.getBookingResponse().getVehicle().getPlateNumber();
                        boolean unique = assignedPlates.add(plate);
                        return new BookingResult(username, plate, unique, null);
                    } catch (Exception e) {
                        exceptions.add(e);
                        return new BookingResult(username, null, false, e);
                    } finally {
                        endLatch.countDown();
                    }
                });
                futures.add(future);
            }

            startLatch.countDown();
            boolean completed = endLatch.await(10, TimeUnit.SECONDS);
            assertTrue(completed, "All threads complete");

            executor.shutdown();

            List<BookingResult> results = new ArrayList<>();
            for (Future<BookingResult> f : futures) results.add(f.get());

            System.out.println("=== Insufficient Vehicle Test Results ===");
            results.forEach(r -> {
                if (r.exception != null)
                    System.out.println(r.username + " - FAILED: " + r.exception.getMessage());
                else
                    System.out.println(r.username + " - SUCCESS: " + r.plateNumber);
            });

            long successCount = results.stream().filter(r -> r.exception == null).count();
            assertEquals(availableCount, successCount,
                    "Only " + availableCount + " users should succeed booking");

            long failCount = results.stream().filter(r -> r.exception != null).count();
            assertEquals(numberOfUsers - availableCount, failCount,
                    "Remaining users should fail booking");

            assertEquals(availableCount, assignedPlates.size(), "Unique plate per successful user");

            verify(vehicleRepository, atLeast(availableCount)).save(any(Vehicle.class));
        }
    }

    // Helper methods
    private void setupSecurityContext(String username) {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);

        when(authentication.getName()).thenReturn(username);
        when(authentication.getAuthorities()).thenReturn(
                (Collection) Collections.singletonList(new SimpleGrantedAuthority("RENTER"))
        );
        when(securityContext.getAuthentication()).thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);
    }

    private User createTestUser(String username) {
        User user = new User();
        user.setUserId((long) username.hashCode());
        user.setUsername(username);
        user.setFullName("Test User " + username);
        user.setEmail(username + "@test.com");
        user.setPhone("0123456789");
        return user;
    }

    private BookingRequest createBookingRequest() {
        BookingRequest request = new BookingRequest();
        request.setStationName("Test Station");
        request.setModelId(1L);
        request.setColor("White");
        request.setTariffId(1L);
        request.setStartTime(LocalDateTime.now().plusDays(1));
        request.setEndTime(LocalDateTime.now().plusDays(2));
        return request;
    }

    // Result holder class
    private static class BookingResult {
        String username;
        String plateNumber;
        boolean isUniqueVehicle;
        Exception exception;

        BookingResult(String username, String plateNumber, boolean isUniqueVehicle, Exception exception) {
            this.username = username;
            this.plateNumber = plateNumber;
            this.isUniqueVehicle = isUniqueVehicle;
            this.exception = exception;
        }
    }
}