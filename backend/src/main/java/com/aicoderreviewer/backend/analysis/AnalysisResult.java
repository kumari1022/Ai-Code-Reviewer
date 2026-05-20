package com.aicoderreviewer.backend.analysis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResult {
    private String tool;
    private String severity;
    private String issue;
    private String fileName;
}