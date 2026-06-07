package com.example.setorsampah.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ==================== FIX: IZINKAN FRONTEND REACT ====================
                        .requestMatchers("/", "/index.html", "/assets/**", "/favicon.svg", "/icons.svg").permitAll()

                        // Endpoint Auth API
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()

                        // Endpoint Authenticated & Role-Based
                        .requestMatchers(HttpMethod.GET, "/api/categories/**", "/api/waste-banks/**", "/api/rewards")
                        .authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/categories/**", "/api/waste-banks/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**", "/api/waste-banks/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**", "/api/waste-banks/**")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/rewards").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/rewards/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/rewards/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/transactions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/transactions").hasAnyRole("ADMIN", "WARGA")
                        .requestMatchers(HttpMethod.POST, "/api/claims").hasRole("WARGA")

                        // Sisa endpoint API lainnya wajib login
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
            .requestMatchers("/", "/index.html", "/assets/**", "/favicon.svg", "/icons.svg");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}