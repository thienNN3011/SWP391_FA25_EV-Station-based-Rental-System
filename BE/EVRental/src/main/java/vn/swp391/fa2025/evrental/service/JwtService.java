package vn.swp391.fa2025.evrental.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Simplified JWT Service - KISS principle
 * Only 3 essential methods for token generation and validation
 */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Generate JWT token for user
     * @param username the username to include in token
     * @param role the user role to include in token
     * @param fullname the fullname to include in token
     * @return JWT token string
     */
    public String generateToken(String username, String role, String fullName) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("fullName", fullName)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .compact();
    }

    /**
     * Validate JWT token
     * @param token the JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean isValidToken(String token) {
        try {
            Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extract claims from JWT token
     * @param token the JWT token
     * @return Claims object containing token data
     */
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public String generatePasswordResetToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("purpose", "PASSWORD_RESET")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 900000))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .compact();
    }

    public String validatePasswordResetToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Check if token is for password reset
            String purpose = claims.get("purpose", String.class);
            if (!"PASSWORD_RESET".equals(purpose)) {
                return null;
            }

            // Check if token is expired
            if (claims.getExpiration().before(new Date())) {
                return null;
            }

            return claims.getSubject(); // Return email
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}
