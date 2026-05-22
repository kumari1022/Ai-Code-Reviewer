package com.aicoderreviewer.backend.config;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config =
                new CorsConfiguration();

        // FRONTEND URL
        config.addAllowedOrigin(
                "http://localhost:5173"
        );

        // ALLOW ALL HEADERS
        config.addAllowedHeader("*");

        // ALLOW ALL METHODS
        config.addAllowedMethod("*");

        // ALLOW CREDENTIALS
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                config
        );

        return new CorsFilter(source);
    }
}