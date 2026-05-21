package com.aicoderreviewer.backend.documentation;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DocumentationService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final DocumentationPromptBuilder promptBuilder;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.groq.com/openai")
            .build();

    public String generateDocumentation(String code) {

        try {

            // NULL CHECK
            if(code == null || code.isBlank()) {

                return """
                        Code input is empty.
                        Please provide valid Java code.
                        """;
            }

            // BUILD PROMPT
            String prompt = promptBuilder
                    .buildDocumentationPrompt(code);

            // REQUEST BODY
            Map<String, Object> requestBody = Map.of(
                    "model", "llama-3.1-8b-instant",
                    "messages", List.of(
                            Map.of(
                                    "role", "user",
                                    "content", prompt
                            )
                    )
            );

            // API CALL
            String response = webClient.post()
                    .uri("/v1/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return response;

        } catch (Exception e) {

            e.printStackTrace();

            return """
                    Documentation generation failed.
                    Please try again later.
                    """;
        }
    }
}