package com.aicoderreviewer.backend.controller;

import com.aicoderreviewer.backend.ai.AIService;
import com.aicoderreviewer.backend.dto.IDERequest;
import com.aicoderreviewer.backend.dto.IDEResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ide")
@RequiredArgsConstructor
public class IDEController {

    private final AIService aiService;

    @PostMapping("/review")
    public IDEResponse reviewCode(
            @RequestBody IDERequest request
    ) {

        String result = aiService.analyzeCode(
                request.getFileName(),
                request.getCode()
        );

        return new IDEResponse(result);
    }
}