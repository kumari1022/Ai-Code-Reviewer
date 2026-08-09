package com.aicoderreviewer.backend.controller;

import com.aicoderreviewer.backend.dto.CodeExecutionRequest;
import com.aicoderreviewer.backend.dto.CodeExecutionResponse;
import com.aicoderreviewer.backend.service.CodeExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    @PostMapping
    public ResponseEntity<CodeExecutionResponse> executeCode(@RequestBody CodeExecutionRequest request) {
        CodeExecutionResponse response = codeExecutionService.executeCode(request);
        return ResponseEntity.ok(response);
    }
}
