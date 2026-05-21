package com.aicoderreviewer.backend.websocket;

import com.aicoderreviewer.backend.ai.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class LiveReviewController {

    private final AIService aiService;

    @MessageMapping("/review")
    @SendTo("/topic/analysis")
    public String analyze(String code) {

        return aiService.analyzeCode(
                "live.java",
                code
        );
    }
}