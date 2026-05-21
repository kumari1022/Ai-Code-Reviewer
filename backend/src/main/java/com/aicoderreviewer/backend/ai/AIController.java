package com.aicoderreviewer.backend.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/review")
    public AIResponse review(
            @RequestBody AIRequest request
    ) {

        String result = aiService
                .analyzeCode(request.getCode());

        return new AIResponse(result);
    }
}