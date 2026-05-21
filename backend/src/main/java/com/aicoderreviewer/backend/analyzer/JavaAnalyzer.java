package com.aicoderreviewer.backend.analyzer;

import org.springframework.stereotype.Service;

@Service
public class JavaAnalyzer implements CodeAnalyzer {

    @Override
    public String analyze(String code) {

        return "Java analysis completed";

    }
}