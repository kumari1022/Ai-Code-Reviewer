package com.aicoderreviewer.backend.ai;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.cache.annotation.Cacheable;
import com.aicoderreviewer.backend.service.LanguageDetectorService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate =
            new RestTemplate();

    @Value("${groq.model}")
    private String model;

    private final PromptBuilder promptBuilder;

    private final LanguageDetectorService detector;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.groq.com/openai")
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();
    @Cacheable(value = "reviews", key = "#code")
    public String analyzeCode(String fileName, String code) {

        try {

            if (code == null || code.isBlank()) {

                return "Code input is empty.";
            }

            // DETECT LANGUAGE
            String language = detector.detectLanguage(fileName);

            // PROMPT
            String prompt = """
                    Analyze this %s code.

                    Give:
                    1. Bugs
                    2. Optimizations
                    3. Security issues
                    4. Code quality suggestions

                    Code:
                    %s
                    """.formatted(language, code);

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
    public String chat(
            String message
    ) {

        try {

            String prompt =

                    "You are an AI coding assistant. " +

                            "Answer the following developer question:\n\n"

                            + message;

            return callGroqAPI(prompt);

        } catch (Exception e) {

            e.printStackTrace();

            return "AI Chat Error";
        }
    }
    private String callGroqAPI(
            String prompt
    ) {

        try {

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_JSON
            );

            headers.setBearerAuth(apiKey);

            JSONObject message =
                    new JSONObject();

            message.put(
                    "role",
                    "user"
            );

            message.put(
                    "content",
                    prompt
            );

            JSONArray messages =
                    new JSONArray();

            messages.put(message);

            JSONObject body =
                    new JSONObject();

            body.put(
                    "model",
                    "llama-3.3-70b-versatile"
            );

            body.put(
                    "messages",
                    messages
            );

            HttpEntity<String> entity =

                    new HttpEntity<>(

                            body.toString(),
                            headers
                    );

            ResponseEntity<String> response =

                    restTemplate.postForEntity(

                            "https://api.groq.com/openai/v1/chat/completions",

                            entity,

                            String.class
                    );

            JSONObject json =
                    new JSONObject(
                            response.getBody()
                    );

            return json
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");

        } catch (Exception e) {

            e.printStackTrace();

            return "Groq API Error";
        }
    }
}