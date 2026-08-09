package com.aicoderreviewer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionResponse {
    private String stdout;
    private String stderr;
    private int exitCode;
    private long executionTimeMs;
}
