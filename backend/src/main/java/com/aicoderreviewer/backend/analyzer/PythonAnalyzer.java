package com.aicoderreviewer.backend.analyzer;

import org.springframework.stereotype.Service;

@Service
public class PythonAnalyzer implements CodeAnalyzer {

    @Override
    public String analyze(String code) {

        return "Python analysis completed";

    }
}