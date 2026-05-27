package com.aicoderreviewer.backend.service;

import com.aicoderreviewer.backend.ai.AIService;
import com.aicoderreviewer.backend.entity.CodeFile;
import com.aicoderreviewer.backend.repository.CodeFileRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final CodeFileRepository repository;

    private final AIService aiService;

    public CodeFile uploadFile(
            MultipartFile file
    ) throws Exception {

        String code =
                new String(file.getBytes());

        String review =
                aiService.analyzeCode(

                        file.getOriginalFilename(),
                        code
                );

        CodeFile codeFile =
                new CodeFile();

        codeFile.setFileName(
                file.getOriginalFilename()
        );

        codeFile.setContent(code);

        codeFile.setReview(review);

        codeFile.setCreatedAt(
                LocalDateTime.now()
        );

        return repository.save(codeFile);
    }
}