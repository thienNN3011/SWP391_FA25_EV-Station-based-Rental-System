package vn.swp391.fa2025.evrental.util;

import jakarta.mail.internet.MimeMessage;
import jakarta.activation.DataSource;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import vn.swp391.fa2025.evrental.entity.User;

@Component
public class EmailUtils {

    @Autowired
    private JavaMailSender mailSender;

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

    private String buildBaseEmailTemplate(String title, String message, String reason, String color) {
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

}
