package com.aicoderreviewer.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.concurrent.CompletableFuture;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Async
    public CompletableFuture<String> analyzeAsync() {

        return CompletableFuture.completedFuture(
                "Analysis completed"
        );
    }

}