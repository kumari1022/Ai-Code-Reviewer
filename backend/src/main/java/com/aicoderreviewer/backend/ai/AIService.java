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

    /**
     * Cached AI review. Key uses file name + content hash so large source
     * files are not stored as Redis keys. Cache failures are handled by
     * {@link com.aicoderreviewer.backend.config.RedisConfig} CacheErrorHandler.
     */
    @Cacheable(value = "reviews", key = "#fileName + '::' + #code.hashCode()")
    public String analyzeCode(String fileName, String code) {

        try {

            if (code == null || code.isBlank()) {

                return "Code input is empty.";
            }

            // DETECT LANGUAGE
            String language = detector.detectLanguage(fileName);

            // LANGUAGE-SPECIFIC AUDIT FOCUS
            String extraRules = switch (language) {
                case "PYTHON" -> "Check PEP 8 style guidelines, type annotation safety, GIL concurrency bottlenecks, resource unclosed streams ('with' statement usage), and SQL/Command injection.";
                case "JAVASCRIPT", "TYPESCRIPT" -> "Check Async/Await error handling, promise rejections, XSS/CSRF exposures, prototype leaks, ES6+ standards, and event listener cleanup.";
                case "CPP" -> "Check raw pointer memory leaks, buffer overflows, dangling references, undefined behavior, use of smart pointers (std::unique_ptr/std::shared_ptr), and thread safety.";
                case "GO" -> "Check Goroutine leaks, channel deadlock risks, error handling conventions (if err != nil), and pointer safety.";
                case "RUST" -> "Check ownership/borrowing anti-patterns, unsafe block justifications, lifetime bounds, and Error handling with Result/Option.";
                case "JAVA" -> "Check thread safety, SQL injection, try-with-resources leaks, Stream API performance, and Spring framework anti-patterns.";
                default -> "Check logic errors, edge cases, performance bottlenecks, security vulnerabilities, and code maintainability.";
            };

            // PROMPT
            String prompt = """
                    You are an expert static analysis engineer. Perform a thorough code review of this %s file ("%s").

                    Specialized Audit Rules for %s:
                    %s

                    Please format your review into the following clear sections using Markdown:

                    ### 1. Executive Summary & Maintainability Score (0-100)
                    ### 2. Critical Bugs & Security Risks
                    ### 3. Performance & Memory Optimizations
                    ### 4. Code Quality & Idiomatic Refactoring
                    ### 5. Recommended Fixed Code Snippet (in ```%s code block)

                    Source Code ("%s"):
                    ```%s
                    %s
                    ```
                    """.formatted(
                            language, 
                            fileName, 
                            language, 
                            extraRules, 
                            language.toLowerCase(), 
                            fileName, 
                            language.toLowerCase(), 
                            code
                    );

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