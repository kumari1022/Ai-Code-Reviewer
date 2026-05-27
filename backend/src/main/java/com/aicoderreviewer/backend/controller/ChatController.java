package com.aicoderreviewer.backend.controller;

import com.aicoderreviewer.backend.ai.AIService;

import com.aicoderreviewer.backend.chat.ChatRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ChatController {

    private final AIService aiService;

    @PostMapping
    public String chat(

            @RequestBody
            ChatRequest request

    ) {

        return aiService.chat(
                request.getMessage()
        );
    }
}