package com.aicoderreviewer.backend.repository;

import com.aicoderreviewer.backend.entity.CodeFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeFileRepository
        extends JpaRepository<CodeFile, Long> {
}