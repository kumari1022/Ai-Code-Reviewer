package com.aicoderreviewer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionRequest {
    private String fileName;
    private String code;
}
