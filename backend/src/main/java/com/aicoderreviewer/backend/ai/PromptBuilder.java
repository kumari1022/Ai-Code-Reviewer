package com.aicoderreviewer.backend.ai;

import org.springframework.stereotype.Component;

@Component
public class PromptBuilder {

    public String buildCodeReviewPrompt(String code) {

        return """
                You are a senior Java software engineer.

                Analyze the following Java code.

                Tasks:
                1. Detect bugs
                2. Suggest optimizations
                3. Identify security issues
                4. Suggest clean code improvements
                5. Explain problems clearly

                Java Code:
                """ + code;
    }
}