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

        CorsConfiguration config = new CorsConfiguration();

        // Local frontend
        config.addAllowedOrigin(
                "http://localhost:5173"
        );

        // Production frontend - Vercel
        config.addAllowedOrigin(
                "https://ai-code-reviewer-ten-navy.vercel.app"
        );

        // Current Vercel deployment URL also allow
        config.addAllowedOrigin(
                "https://ai-code-reviewer-auxzv9b7c-ai-code-reviewer1.vercel.app"
        );

        config.addAllowedHeader("*");

        config.addAllowedMethod("*");

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