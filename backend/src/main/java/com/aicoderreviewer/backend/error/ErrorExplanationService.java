package com.aicoderreviewer.backend.error;

import org.springframework.stereotype.Service;

@Service
public class ErrorExplanationService {

    public String explain(String error) {

        // NULL CHECK
        if(error == null || error.isBlank()) {

            return """
                    Error message is empty.

                    Please provide a valid Java exception.
                    """;
        }

        if(error.contains("NullPointerException")) {

            return """
                    A NullPointerException occurs when
                    an object is used before initialization.

                    Fix:
                    - Check if object is null
                    - Initialize before usage
                    """;
        }

        if(error.contains("ArrayIndexOutOfBoundsException")) {

            return """
                    Array index exceeds array size.
                    """;
        }

        return "Unknown error";
    }
}