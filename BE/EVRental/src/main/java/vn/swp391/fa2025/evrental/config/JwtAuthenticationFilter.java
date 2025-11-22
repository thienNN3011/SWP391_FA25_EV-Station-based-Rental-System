package vn.swp391.fa2025.evrental.config;

import vn.swp391.fa2025.evrental.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filter xử lý JWT token trong mỗi request
 * Validate token, extract username/role, set vào SecurityContext
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;  // Service xử lý JWT (validate, extract claims)

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

        // Lấy JWT token từ header Authorization (format: "Bearer <token>")
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);  // Cắt bỏ "Bearer "

                // Validate token và extract thông tin user
                if (jwtService.isValidToken(token)) {
                    Claims claims = jwtService.extractClaims(token);
                    String username = claims.getSubject();
                    String role = claims.get("role", String.class);
                    String fullName = claims.get("fullName", String.class);

                    // Tạo Authentication object và set vào SecurityContext
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            username, null, List.of(new SimpleGrantedAuthority(role)));

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                // Ignore invalid token (endpoint public không cần token)
            }
        }

        filterChain.doFilter(request, response);
    }
}
