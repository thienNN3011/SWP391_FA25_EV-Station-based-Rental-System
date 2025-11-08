package vn.swp391.fa2025.evrental.util;

import jakarta.mail.internet.MimeMessage;
import jakarta.activation.DataSource;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.SystemConfig;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.service.SystemConfigServiceImpl;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Component
public class EmailUtils {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SystemConfigServiceImpl systemConfigService;

    public void sendEmailWithAttachment(String to, String subject, String htmlBody, byte[] attachment, String fileName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            if (attachment != null && fileName != null) {
                DataSource dataSource = new ByteArrayDataSource(attachment, "application/pdf");
                helper.addAttachment(fileName, dataSource);
            }

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage(), e);
        }
    }

    public void sendRejectionEmail(User user, String reason) {
        String subject = "Tài khoản của bạn đã bị từ chối duyệt";
        String body = buildBaseEmailTemplate(
                "Tài khoản bị từ chối duyệt",
                String.format("Xin chào <b>%s</b>,<br>Rất tiếc, tài khoản của bạn đã bị <b style='color:red;'>từ chối duyệt</b>. Vui lòng kiểm tra lại thông tin đăng ký.",
                        user.getFullName() != null ? user.getFullName() : user.getUsername()
                ),
                reason,
                "#d32f2f"
        );
        sendEmailWithAttachment(user.getEmail(), subject, body, null, null);
    }

    public void sendActivatedEmail(User user) {
        String subject = "Tài khoản của bạn đã được kích hoạt";
        String body = buildBaseEmailTemplate(
                "Tài khoản kích hoạt thành công",
                String.format("Xin chào <b>%s</b>,<br>Tài khoản của bạn đã được kích hoạt thành công. Giờ đây bạn có thể đăng nhập vào hệ thống EV Rental và sử dụng dịch vụ.",
                        user.getFullName() != null ? user.getFullName() : user.getUsername()
                ),
                null,
                "#388e3c"
        );
        sendEmailWithAttachment(user.getEmail(), subject, body, null, null);
    }

    public void sendDeactivatedEmail(User user) {
        String subject = "Tài khoản của bạn đã bị vô hiệu hóa";
        String body = buildBaseEmailTemplate(
                "Tài khoản bị vô hiệu hóa",
                String.format("Xin chào <b>%s</b>,<br>Tài khoản của bạn đã bị vô hiệu hóa. Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ bộ phận hỗ trợ EV Rental.",
                        user.getFullName() != null ? user.getFullName() : user.getUsername()
                ),
                null,
                "#f57c00"
        );
        sendEmailWithAttachment(user.getEmail(), subject, body, null, null);
    }

    public void sendPendingEmail(User user) {
        String subject = "Tài khoản của bạn đang được xem xét";
        String body = buildBaseEmailTemplate(
                "Tài khoản đang chờ duyệt",
                String.format("Xin chào <b>%s</b>,<br>Tài khoản của bạn hiện đang được <b>xem xét lại</b>. Chúng tôi sẽ thông báo kết quả trong thời gian sớm nhất.",
                        user.getFullName() != null ? user.getFullName() : user.getUsername()
                ),
                null,
                "#1976d2"
        );
        sendEmailWithAttachment(user.getEmail(), subject, body, null, null);
    }

    public void sendRegistrationSuccessEmail(User user) {
        String subject = "Đăng ký tài khoản thành công - Đang chờ phê duyệt";
        String body = buildBaseEmailTemplate(
                "Đăng ký tài khoản thành công 🎉",
                String.format(
                        "Xin chào <b>%s</b>,<br>"
                                + "Cảm ơn bạn đã đăng ký tài khoản tại <b>EV Rental</b>!<br>"
                                + "Tài khoản của bạn đã được ghi nhận và hiện đang trong quá trình <b>phê duyệt</b>.<br><br>"
                                + "Chúng tôi sẽ gửi email cho bạn ngay khi tài khoản được kích hoạt.<br>"
                                + "Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ <a href='mailto:support@evrental.vn'>support@evrental.vn</a>.",
                        user.getFullName() != null ? user.getFullName() : user.getUsername()
                ),
                null,
                "#1976d2"
        );
        sendEmailWithAttachment(user.getEmail(), subject, body, null, null);
    }


    public String buildBaseEmailTemplate(String title, String message, String reason, String color) {
        return String.format("""
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 20px;">
        <table align="center" cellpadding="0" cellspacing="0" width="600" 
               style="background-color: #fff; border-radius: 12px; box-shadow: 0 3px 8px rgba(0,0,0,0.05); overflow: hidden;">
            <tr style="background-color: #1976d2;">
                <td style="padding: 20px; text-align: center; color: #fff;">
                    <h2 style="margin: 0;">EV Rental</h2>
                    <p style="margin: 0; font-size: 14px;">Hệ thống thuê xe điện thông minh</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px;">
                    <h3 style="color: %s;">%s</h3>
                    <p style="font-size: 15px; color: #333;">%s</p>
                    %s
                    <br><br>
                    <p style="font-size: 14px; color: #777;">Trân trọng,<br><b>Đội ngũ EV Rental</b></p>
                </td>
            </tr>
            <tr>
                <td style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #888;">
                    © 2025 EV Rental. All rights reserved.
                </td>
            </tr>
        </table>
    </body>
    </html>
    """,
                color, title, message,
                (reason != null && !reason.isBlank())
                        ? "<p style='background-color:#f9f9f9; padding:10px; border-left:4px solid "+color+";'><b>Lý do:</b> " + reason + "</p>"
                        : ""
        );
    }

    public void sendBookingSuccessEmail(Booking booking) {
        String subject = "Xác nhận đặt xe thành công - EV Rental";

        SystemConfig cancelBeforeConfig = systemConfigService.getSystemConfigByKey("CANCEL_BOOKING_REFUND_EXPIRE");
        SystemConfig refundRateConfig = systemConfigService.getSystemConfigByKey("REFUND");
        SystemConfig lateCheckinConfig = systemConfigService.getSystemConfigByKey("CHECK_IN_EXPIRE");

        String cancelBefore = cancelBeforeConfig != null ? cancelBeforeConfig.getValue() : "30";
        String refundRate = refundRateConfig != null ? refundRateConfig.getValue() : "70";
        String lateCheckin = lateCheckinConfig != null ? lateCheckinConfig.getValue() : "30";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");

        String message = String.format("""
            Xin chào <b>%s</b>,<br>
            Cảm ơn bạn đã đặt xe tại <b>EV Rental</b>!<br><br>
            <b>Thông tin đặt xe:</b><br>
            • Mã đơn thuê: <b>#%d</b><br>
            • Xe: <b>%s</b><br>
            • Bắt đầu: <b>%s</b><br>
            • Kết thúc: <b>%s</b><br>
            • Tổng tiền: <b>%s VND</b><br><br>
            <b>Chính sách:</b><br>
            - Bạn có thể hủy trước <b>%s phút</b> để được hoàn <b>%s%% tiền đặt cọc</b>.<br>
            - Nếu đến muộn hơn <b>%s phút</b> kể từ thời gian bắt đầu, đơn sẽ bị hủy và không hoàn cọc.<br>
            - Khi đến nhận xe quý khách vui lòng đem theo căn cước công dân và giấy phép lái xe để chứng minh.<br><br>
            Hẹn gặp lại bạn tại EV Rental!
        """,
                booking.getUser().getFullName() != null ? booking.getUser().getFullName() : booking.getUser().getUsername(),
                booking.getBookingId(),
                booking.getVehicle().getModel().getName(),
                booking.getStartTime().format(formatter),
                booking.getEndTime().format(formatter),
                booking.getTariff().getDepositAmount(),
                cancelBefore,
                refundRate,
                lateCheckin
        );

        String body = buildBaseEmailTemplate(
                "Đặt xe thành công 🎉",
                message,
                null,
                "#2e7d32"
        );

        sendEmailWithAttachment(booking.getUser().getEmail(), subject, body, null, null);
    }

    public void sendBookingCompletedEmail(Booking booking, BigDecimal refundedAmount) {
        String subject = "Hoàn tất chuyến thuê xe - EV Rental";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");

        String refundInfo;
        if (refundedAmount != null && refundedAmount.compareTo(BigDecimal.ZERO) > 0) {
            refundInfo = String.format("<p><b>Số tiền đặt cọc đã hoàn trả:</b> %,.0f VND</p>", refundedAmount);
        } else {
            refundInfo = "<p><b>Số tiền đặt cọc đã hoàn trả:</b> Không có (do không đáp ứng điều kiện hoàn tiền)</p>";
        }

        String message = String.format("""
        Xin chào <b>%s</b>,<br>
        Cảm ơn bạn đã sử dụng dịch vụ của <b>EV Rental</b>!<br><br>
        Chuyến thuê xe của bạn đã được <b>hoàn tất</b> thành công.<br><br>

        <b>Thông tin chuyến đi:</b><br>
        • Xe: <b>%s</b><br>
        • Bắt đầu: <b>%s</b><br>
        • Kết thúc: <b>%s</b><br>
        • Tổng chi phí: <b>%,.0f VND</b><br>
        • Số km sử dụng: <b>%s km</b><br>
        %s
        <br>
        <b>Trạng thái:</b> Đơn hàng đã hoàn tất ✅<br><br>

        Hy vọng bạn hài lòng với trải nghiệm cùng EV Rental.<br>
    """,
                booking.getUser().getFullName() != null ? booking.getUser().getFullName() : booking.getUser().getUsername(),
                booking.getVehicle().getModel().getName(),
                booking.getActualStartTime().format(formatter),
                booking.getActualEndTime().isAfter(booking.getEndTime())?booking.getActualEndTime().format(formatter):booking.getEndTime().format(formatter),
                booking.getTotalAmount(),
                (booking.getStartOdo() != null && booking.getEndOdo() != null)
                        ? (booking.getEndOdo() - booking.getStartOdo())
                        : "Không xác định",
                refundInfo
        );

        String body = buildBaseEmailTemplate(
                "Hoàn tất chuyến đi 🚗",
                message,
                null,
                "#2e7d32"
        );

        sendEmailWithAttachment(booking.getUser().getEmail(), subject, body, null, null);
    }

    public void sendStaffStationChangedEmail(User staff, String newStation, String newStationAddress) {
        String subject = "Thông báo trạm làm việc mới - EV Rental";

        String message = String.format("""
        Xin chào <b>%s</b>,<br>
        Chúng tôi xin thông báo rằng bạn đã được phân công làm việc tại trạm mới:<br><br>
        <b>Trạm:</b> %s<br>
        <b>Địa chỉ:</b> %s<br><br>
        Vui lòng đến trạm mới để nhận lịch làm việc và phân công công việc cụ thể.<br><br>
        Nếu có bất kỳ thắc mắc nào, bạn có thể liên hệ bộ phận quản lý để được hỗ trợ.<br><br>
        Chúc bạn có một ngày làm việc hiệu quả cùng EV Rental!
    """,
                staff.getFullName() != null ? staff.getFullName() : staff.getUsername(),
                newStation,
                newStationAddress != null ? newStationAddress : "(chưa cập nhật)"
        );

        String body = buildBaseEmailTemplate(
                "Thông báo trạm làm việc mới 📍",
                message,
                null,
                "#1976d2"
        );

        sendEmailWithAttachment(staff.getEmail(), subject, body, null, null);
    }
    public void sendPasswordResetEmail(User user, String resetLink) {
        String subject = "Yêu cầu đặt lại mật khẩu - EV Rental";

        String message = String.format("""
        Xin chào <b>%s</b>,<br><br>
        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.<br><br>
        Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:<br><br>
        <a href="%s" style="background-color: #1976d2; color: white; padding: 12px 24px; 
        text-decoration: none; border-radius: 6px; display: inline-block;">
        🔑 Đặt lại mật khẩu
        </a><br><br>
        <p style="color: #d32f2f;"><b>Lưu ý:</b> Link này sẽ hết hạn sau 15 phút.</p>
        <p style="font-size: 13px; color: #666;">
        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
        </p>
    """,
                user.getFullName() != null ? user.getFullName() : user.getUsername(),
                resetLink
        );

        String body = buildBaseEmailTemplate(
                "Đặt lại mật khẩu 🔐",
                message,
                null,
                "#1976d2"
        );

        sendEmailWithAttachment(user.getEmail(), subject, body, null, null);
    }
    public void sendPasswordChangedConfirmationEmail(User user) {
        String subject = "Mật khẩu đã được thay đổi - EV Rental";

        String message = String.format("""
        Xin chào <b>%s</b>,<br><br>
        Mật khẩu tài khoản của bạn vừa được thay đổi thành công.<br><br>
        <p style="color: #388e3c;">✅ Thời gian thay đổi: <b>%s</b></p>
        <p style="font-size: 13px; color: #d32f2f;">
        <b>Lưu ý:</b> Nếu bạn không thực hiện thay đổi này, 
        vui lòng liên hệ ngay với bộ phận hỗ trợ: 
        <a href="mailto:support@evrental.vn">support@evrental.vn</a>
        </p>
    """,
                user.getFullName() != null ? user.getFullName() : user.getUsername(),
                java.time.LocalDateTime.now().format(
                        java.time.format.DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")
                )
        );

        String body = buildBaseEmailTemplate(
                "Mật khẩu đã thay đổi ✅",
                message,
                null,
                "#388e3c"
        );

        sendEmailWithAttachment(user.getEmail(), subject, body, null, null);
    }
}
