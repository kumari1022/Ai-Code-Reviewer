package com.aicoderreviewer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedCodeDTO {
    private Long id;
    private String title;
    private String fileName;
    private String language;
    private String code;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
