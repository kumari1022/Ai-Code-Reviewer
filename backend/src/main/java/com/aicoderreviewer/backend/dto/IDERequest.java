package com.aicoderreviewer.backend.dto;

import lombok.Data;

@Data
public class IDERequest {

    private String fileName;

    private String code;
}