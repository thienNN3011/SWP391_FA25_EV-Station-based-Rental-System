package vn.swp391.fa2025.evrental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.PaymentReturnResponse;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Payment;
import vn.swp391.fa2025.evrental.service.BookingServiceImpl;
import vn.swp391.fa2025.evrental.service.PaymentServiceImpl;
import vn.swp391.fa2025.evrental.service.VnPayService;
import vn.swp391.fa2025.evrental.util.TimeUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController

@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private VnPayService vnPayService;
    @Autowired
    private BookingServiceImpl bookingService;
    @Autowired
    private PaymentServiceImpl paymentService;
    @Value("${vnpay.hashSecret}")
    private String vnp_HashSecret;

    @GetMapping("/vnpay-return")
    public ApiResponse<PaymentReturnResponse> returnPayment(@RequestParam Map<String, String> params){
        ApiResponse<PaymentReturnResponse> response = new ApiResponse<>();
        String vnp_SecureHash = params.get("vnp_SecureHash");
        Map<String, String> filteredParams = new HashMap<>(params);
        filteredParams.remove("vnp_SecureHash");
        filteredParams.remove("vnp_SecureHashType");
        List<String> fieldNames = new ArrayList<>(filteredParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        for (Iterator<String> itr = fieldNames.iterator(); itr.hasNext();) {
            String fieldName = itr.next();
            String fieldValue = filteredParams.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        String computedHash = "";
        try {
            computedHash = vnPayService.hmacSHA512(vnp_HashSecret, hashData.toString());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (!computedHash.equalsIgnoreCase(vnp_SecureHash)) {
            response.setSuccess(false);
            response.setCode(97);
            response.setMessage("Sai chữ ký bảo mật! Dữ liệu không hợp lệ.");
            response.setData(null);
            return response;
        }

        String responseCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");
        String transactionNo = params.get("vnp_TransactionNo");
        String amount = params.get("vnp_Amount");
        String bankCode = params.get("vnp_BankCode");
        String payDate = params.get("vnp_PayDate");
        if ("00".equals(responseCode)) {
            Long bookingId= Long.parseLong(txnRef.substring(txnRef.indexOf("BID")+3, txnRef.length()));
            Booking booking= bookingService.findById(bookingId);
            BigDecimal amount_bc;

            try {
                amount_bc = new BigDecimal(amount);
            } catch (NumberFormatException e) {
                throw new RuntimeException(e);
            }
            BigDecimal realAmount = amount_bc.divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);
            String paymentType= (paymentService.getPaymentByBookingIdAndType(bookingId, "DEPOSIT") != null) ? "FINAL_PAYMENT" : "DEPOSIT";
            Payment payment = Payment.builder()
                    .booking(booking)
                    .paymentType(paymentType)
                    .amount(realAmount)
                    .referenceCode(transactionNo)
                    .transactionDate(TimeUtils.parsePayDate(payDate))
                    .build();
            paymentService.createPayment(payment);
            PaymentReturnResponse paymentReturnResponse = PaymentReturnResponse.builder()
                    .referenceCode(payment.getReferenceCode())
                    .amount(payment.getAmount())
                    .bankCode(bankCode)
                    .paymentDate(payment.getTransactionDate())
                    .build();
            response.setSuccess(true);
            if (paymentType.equalsIgnoreCase("DEPOSIT")) {
                response.setMessage("Thanh toán đặt cọc thành công!");
                booking.setStatus("BOOKING");
                bookingService.updateBooking(booking);
            } else {
                response.setMessage("Thanh toán thành công!");
                booking.setStatus("COMPLETED");
                bookingService.updateBooking(booking);
            }
            response.setData(paymentReturnResponse);
            response.setCode(200);
            return response;
        } else {
            Long bookingId= Long.parseLong(txnRef.substring(txnRef.indexOf("BID")+3), txnRef.length());
            String paymentType= (paymentService.getPaymentByBookingIdAndType(bookingId, "DEPOSIT") != null) ? "FINAL_PAYMENT" : "DEPOSIT";
            response.setSuccess(false);
            if (paymentType.equalsIgnoreCase("DEPOSIT")) response.setMessage("Thanh toán đặt cọc thất bại!"+responseCode); else response.setMessage("Thanh toán thất bại!"+responseCode);
            response.setData(null);
            response.setCode(400);
            return  response;
        }
    }
}
