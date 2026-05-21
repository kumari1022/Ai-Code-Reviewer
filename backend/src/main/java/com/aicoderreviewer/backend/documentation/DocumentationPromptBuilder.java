package com.aicoderreviewer.backend.documentation;

import org.springframework.stereotype.Component;

@Component
public class DocumentationPromptBuilder {

    public String buildDocumentationPrompt(String code) {

        return """
                You are a senior Java developer.

                Generate professional documentation
                for the following Java code.

                Include:
                1. Class description
                2. Method explanations
                3. JavaDocs
                4. Developer-friendly explanation

                Java Code:
                """ + code;
    }
}