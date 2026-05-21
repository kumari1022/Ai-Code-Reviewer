package com.aicoderreviewer.backend.error;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class ErrorExplanationService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.model}")
    private String model;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.groq.com/openai")
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String explain(String error) {

        try {

            // NULL CHECK
            if (error == null || error.isBlank()) {

                return """
                        Error message is empty.
                        Please provide valid Java exception.
                        """;
            }

            // LOCAL FAST RULES
            if (error.contains("NullPointerException")) {

                return """
                        NullPointerException occurs when
                        an object is used before initialization.

                        Fix:
                        - Initialize object
                        - Check for null before usage
                        """;
            }

            if (error.contains("ArrayIndexOutOfBoundsException")) {

                return """
                        Array index exceeds array size.

                        Fix:
                        - Check array bounds
                        - Use valid indexes
                        """;
            }

            // AI PROMPT
            String prompt = "Explain this Java exception: " + error;

            // SAFE JSON BODY
            Map<String, Object> message = Map.of(
                    "role", "user",
                    "content", prompt
            );

            Map<String, Object> requestBody = Map.of(
                    "model", model,
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
                                    .map(errorBody -> new RuntimeException(errorBody))
                    )
                    .bodyToMono(String.class)
                    .block();

            // DEBUG RESPONSE
            System.out.println(response);

            // PARSE AI RESPONSE
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
                    AI service temporarily unavailable.

                    Please try again later.
                    """;
        }
    }
}