package com.aicoderreviewer.backend.service;

import org.springframework.stereotype.Service;

@Service
public class LanguageDetectorService {

    public String detectLanguage(String fileName) {

        String extension = fileName
                .substring(fileName.lastIndexOf("."));

        switch (extension) {

            case ".java":
                return "JAVA";

            case ".py":
                return "PYTHON";

            case ".js":
                return "JAVASCRIPT";

            case ".cpp":
                return "CPP";

            case ".go":
                return "GO";

            case ".rs":
                return "RUST";

            default:
                return "UNSUPPORTED";
        }
    }
}