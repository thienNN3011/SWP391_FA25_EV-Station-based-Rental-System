package vn.swp391.fa2025.evrental.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                        .requestMatchers("/auth/**", "/", "/hello", "/error", "/vehiclemodel", "/showactivestation",
                                "/vehiclemodel/getvehicelmodeldetail").permitAll()
                        .requestMatchers("/EVRental/**", "/**.jpg", "/**.jpeg", "/**.png").permitAll()

                        .requestMatchers(HttpMethod.GET, "/showallrenters").hasAnyAuthority("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/showallstaffs").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/updateuser").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/deleteuser/**").hasAnyAuthority("STAFF", "ADMIN")

                        .requestMatchers("/showpendingaccount", "/changeaccountstatus", "/showdetailofpendingaccount")
                        .hasAnyAuthority("STAFF", "ADMIN")
                        .requestMatchers("/bookings/confirm", "/bookings/reject").hasAuthority("RENTER")
                        .requestMatchers("/bookings/startrental").hasAuthority("STAFF")
                        .requestMatchers("/bookings/createbooking").hasAnyAuthority("USER", "RENTER")
                        .requestMatchers("bookings/showbookingbystatus", "bookings/showdetailbooking")
                        .hasAnyAuthority("RENTER",  "ADMIN", "STAFF")
                        //CRUD VEHICLE
                        .requestMatchers(HttpMethod.GET, "/veh  icles/showall", "/vehicles/showbyid/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/vehicles/create").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/vehicles/update/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/vehicles/delete/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/station/me").hasAnyAuthority("STAFF", "ADMIN")
                        // booking sua loi 403
                        .requestMatchers(HttpMethod.POST, "/EVRental/bookings/createbooking").permitAll()


                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:3000"));
        config.setAllowedMethods(
            Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
