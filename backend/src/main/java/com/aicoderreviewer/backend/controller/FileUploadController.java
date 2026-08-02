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
@CrossOrigin("*")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(

            @RequestParam("file")
            MultipartFile file

    ) {

        try {

            System.out.println("UPLOAD STARTED");

            CodeFile uploaded =
                    fileUploadService
                            .uploadFile(file);

            System.out.println("UPLOAD SUCCESS");

            return ResponseEntity.ok(uploaded);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}