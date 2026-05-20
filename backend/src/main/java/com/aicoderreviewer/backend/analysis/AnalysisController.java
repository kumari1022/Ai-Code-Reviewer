package com.aicoderreviewer.backend.analysis;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
@RestController
@RequestMapping("/api/analyze")
@RequiredArgsConstructor
public class AnalysisController {
    private final SpotBugsService spotBugsService;
    private final PMDService pmdService;
    @GetMapping("/{fileName}")
    public List<AnalysisResult> analyze(
            @PathVariable String fileName
    ) {
        List<AnalysisResult> results = new ArrayList<>();
        results.addAll(spotBugsService.analyze(fileName));
        results.addAll(pmdService.analyze(fileName));
        return results;
    }
}