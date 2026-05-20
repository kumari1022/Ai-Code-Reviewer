package com.aicoderreviewer.backend.controller;

import com.aicoderreviewer.backend.entity.CodeFile;
import com.aicoderreviewer.backend.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileUploadService
            fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<CodeFile> uploadFile(
            @RequestParam("file")
            MultipartFile file
    ) {

        try {

            CodeFile uploaded =
                    fileUploadService
                            .uploadFile(file);

            return ResponseEntity.ok(uploaded);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }
    }
}