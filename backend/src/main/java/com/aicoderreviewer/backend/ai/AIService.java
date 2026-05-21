package com.aicoderreviewer.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.model}")
    private String model;

    private final PromptBuilder promptBuilder;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.groq.com/openai")
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String analyzeCode(String code) {

        try {

            if (code == null || code.isBlank()) {

                return "Code input is empty.";
            }

            String prompt = promptBuilder
                    .buildCodeReviewPrompt(code);

            // MESSAGE
            Map<String, Object> message = Map.of(
                    "role", "user",
                    "content", prompt
            );

            // REQUEST BODY
            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "temperature", 0.3,
                    "messages", List.of(message)
            );

            // API CALL
            String response = webClient.post()
                    .uri("/v1/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(
                            status -> status.isError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .map(RuntimeException::new)
                    )
                    .bodyToMono(String.class)
                    .block();

            // PARSE RESPONSE
            JsonNode jsonNode = objectMapper.readTree(response);

            return jsonNode
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

        } catch (Exception e) {

            e.printStackTrace();

            return """
                    AI analysis temporarily unavailable.
                    Please try again later.
                    """;
        }
    }
}