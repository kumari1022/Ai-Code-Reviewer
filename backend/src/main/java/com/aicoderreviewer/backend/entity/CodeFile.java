package com.aicoderreviewer.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CodeFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Column(columnDefinition = "TEXT")
    private String code;

    @Column(columnDefinition = "TEXT")
    private String review;
}