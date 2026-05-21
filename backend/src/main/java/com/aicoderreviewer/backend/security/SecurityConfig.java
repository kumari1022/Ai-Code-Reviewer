package com.aicoderreviewer.backend.security;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .formLogin(form -> form.disable())

                .httpBasic(httpBasic -> httpBasic.disable())

                // Stateless JWT Auth
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // API Authorization
                .authorizeHttpRequests(auth -> auth

                        // PUBLIC ENDPOINTS
                        .requestMatchers(
                                "/api/auth/**"
                        )

                        .permitAll()

                        // ADMIN ENDPOINTS
                        .requestMatchers(
                                "/api/admin/**"
                        )

                        .hasRole("ADMIN")

                        // EVERYTHING ELSE
                        .anyRequest()

                        .authenticated()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }

}