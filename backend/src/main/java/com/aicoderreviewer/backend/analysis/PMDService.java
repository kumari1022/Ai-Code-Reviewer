package com.aicoderreviewer.backend.analysis;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class PMDService {

    public List<AnalysisResult> analyze(String fileName) {

        List<AnalysisResult> results = new ArrayList<>();

        results.add(new AnalysisResult(
                "PMD",
                "LOW",
                "Method is too long",
                fileName
        ));

        results.add(new AnalysisResult(
                "PMD",
                "MEDIUM",
                "Avoid nested loops",
                fileName
        ));

        return results;
    }
}