package com.aicoderreviewer.backend.analysis;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
@Service
public class SpotBugsService {
    public List<AnalysisResult> analyze(String fileName) {
        List<AnalysisResult> results = new ArrayList<>();
        results.add(new AnalysisResult(
                "SpotBugs",
                "HIGH",
                "Possible Null Pointer Exception",
                fileName
        ));
        results.add(new AnalysisResult(
                "SpotBugs",
                "MEDIUM",
                "Unused variable detected",
                fileName
        ));
        return results;
    }
}