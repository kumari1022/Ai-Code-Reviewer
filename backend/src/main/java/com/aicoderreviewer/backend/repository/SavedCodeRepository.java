package com.aicoderreviewer.backend.repository;

import com.aicoderreviewer.backend.model.SavedCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedCodeRepository extends JpaRepository<SavedCode, Long> {
    List<SavedCode> findByUserEmailOrderByCreatedAtDesc(String email);
    Optional<SavedCode> findByIdAndUserEmail(Long id, String email);
}
