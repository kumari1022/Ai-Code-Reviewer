package com.aicoderreviewer.backend.documentation;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/docs")
@RequiredArgsConstructor
public class DocumentationController {

    private final DocumentationService documentationService;

    @PostMapping("/generate")
    public DocumentationResponse generate(
            @RequestBody DocumentationRequest request
    ) {

        String result = documentationService
                .generateDocumentation(request.getCode());

        return new DocumentationResponse(result);
    }
}