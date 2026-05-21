package com.aicoderreviewer.backend.error;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/errors")
@RequiredArgsConstructor
public class ErrorController {

    private final ErrorExplanationService service;

    @PostMapping("/explain")
    public ErrorResponse explain(
            @RequestBody ErrorRequest request
    ) {

        String explanation = service
                .explain(request.getErrorMessage());

        return new ErrorResponse(explanation);
    }
}