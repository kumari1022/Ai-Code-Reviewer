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

    private static final String UPLOAD_DIR = "uploads/";

    public CodeFile uploadFile(MultipartFile file)
            throws IOException {

        if (!file.getOriginalFilename()
                .endsWith(".java")) {

            throw new RuntimeException(
                    "Only Java files are allowed"
            );
        }

        String uniqueFileName =
                UUID.randomUUID() + "_"
                        + file.getOriginalFilename();

        String filePath =
                UPLOAD_DIR + uniqueFileName;

        File uploadFolder =
                new File(UPLOAD_DIR);

        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        file.transferTo(new File(filePath));

        CodeFile codeFile = CodeFile.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .filePath(filePath)
                .fileSize(file.getSize())
                .uploadedAt(LocalDateTime.now())
                .build();

        return repository.save(codeFile);
    }
}