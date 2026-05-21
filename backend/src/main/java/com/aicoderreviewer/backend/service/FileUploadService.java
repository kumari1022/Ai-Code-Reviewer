package com.aicoderreviewer.backend.service;

import com.aicoderreviewer.backend.entity.CodeFile;

import com.aicoderreviewer.backend.repository.CodeFileRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;

import java.io.IOException;

import java.time.LocalDateTime;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final CodeFileRepository repository;

    private static final String UPLOAD_DIR =
            "uploads/";

    public CodeFile uploadFile(
            MultipartFile file
    ) throws IOException {

        String fileName =
                file.getOriginalFilename();

        // VALIDATION
        if(fileName == null ||
                fileName.isBlank()) {

            throw new RuntimeException(
                    "Invalid file name."
            );
        }

        // ALLOW ONLY JAVA FILES
        if(!fileName.endsWith(".java")) {

            throw new RuntimeException(
                    "Only Java files allowed."
            );
        }

        // SAFE FILE NAME
        String safeFileName =
                UUID.randomUUID()
                        + "_" + fileName;

        String filePath =
                UPLOAD_DIR + safeFileName;

        System.out.println(
                "Uploading file: " + safeFileName
        );

        file.transferTo(
                new File(filePath)
        );

        CodeFile codeFile =
                CodeFile.builder()

                        .fileName(fileName)

                        .fileType(
                                file.getContentType()
                        )

                        .filePath(filePath)

                        .fileSize(file.getSize())

                        .uploadedAt(
                                LocalDateTime.now()
                        )

                        .build();

        return repository.save(codeFile);
    }
}