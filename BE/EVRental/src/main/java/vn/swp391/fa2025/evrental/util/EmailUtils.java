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
        String to = user.getEmail();
        String subject = "Tài khoản của bạn đã bị từ chối duyệt";
        String htmlBody = String.format("""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h3 style="color: #d32f2f;">Tài khoản của bạn đã bị từ chối duyệt</h3>
            <p>Xin chào <b>%s</b>,</p>
            <p>Rất tiếc, tài khoản của bạn đã bị <b style="color:red;">từ chối duyệt</b>.</p>
            <p><b>Lý do:</b> %s</p>
            <p>Nếu bạn có thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ EV Rental.</p>
            <br>
            <p>Trân trọng,<br>Đội ngũ EV Rental</p>
        </body>
        </html>
        """,
                user.getFullName() != null ? user.getFullName() : user.getUsername(),
                (reason != null && !reason.isBlank()) ? reason : "Không có lý do cụ thể."
        );

        sendEmailWithAttachment(to, subject, htmlBody, null, null);
    }


}
