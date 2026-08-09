package com.aicoderreviewer.backend.service;

import org.springframework.stereotype.Service;

@Service
public class LanguageDetectorService {

    public String detectLanguage(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "GENERAL_CODE";
        }

        String extension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();

        switch (extension) {
            case ".java":
                return "JAVA";

            case ".py":
            case ".pyw":
                return "PYTHON";

            case ".js":
            case ".jsx":
            case ".mjs":
            case ".cjs":
                return "JAVASCRIPT";

            case ".ts":
            case ".tsx":
                return "TYPESCRIPT";

            case ".cpp":
            case ".c":
            case ".cc":
            case ".cxx":
            case ".h":
            case ".hpp":
                return "CPP";

            case ".go":
                return "GO";

            case ".rs":
                return "RUST";

            case ".cs":
                return "CSHARP";

            case ".php":
                return "PHP";

            case ".rb":
                return "RUBY";

            case ".sql":
                return "SQL";

            default:
                return "GENERAL_CODE";
        }
    }
}