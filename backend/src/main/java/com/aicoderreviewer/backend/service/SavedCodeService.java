package com.aicoderreviewer.backend.service;

import com.aicoderreviewer.backend.dto.SavedCodeDTO;
import com.aicoderreviewer.backend.model.SavedCode;
import com.aicoderreviewer.backend.user.User;
import com.aicoderreviewer.backend.user.UserRepository;
import com.aicoderreviewer.backend.repository.SavedCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedCodeService {

    private final SavedCodeRepository savedCodeRepository;
    private final UserRepository userRepository;

    public SavedCodeDTO saveCode(String email, SavedCodeDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        String language = dto.getLanguage();
        if (language == null || language.isBlank()) {
            language = detectLanguageFromFileName(dto.getFileName());
        }

        SavedCode savedCode = SavedCode.builder()
                .title(dto.getTitle() != null && !dto.getTitle().isBlank() ? dto.getTitle() : dto.getFileName())
                .fileName(dto.getFileName() != null ? dto.getFileName() : "Main.java")
                .language(language)
                .code(dto.getCode() != null ? dto.getCode() : "")
                .user(user)
                .build();

        SavedCode saved = savedCodeRepository.save(savedCode);
        return mapToDTO(saved);
    }

    public List<SavedCodeDTO> getUserSavedCodes(String email) {
        return savedCodeRepository.findByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SavedCodeDTO getSavedCodeById(Long id, String email) {
        SavedCode savedCode = savedCodeRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Saved code not found with ID: " + id));
        return mapToDTO(savedCode);
    }

    public void deleteSavedCode(Long id, String email) {
        SavedCode savedCode = savedCodeRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Saved code not found with ID: " + id));
        savedCodeRepository.delete(savedCode);
    }

    private SavedCodeDTO mapToDTO(SavedCode code) {
        return SavedCodeDTO.builder()
                .id(code.getId())
                .title(code.getTitle())
                .fileName(code.getFileName())
                .language(code.getLanguage())
                .code(code.getCode())
                .createdAt(code.getCreatedAt())
                .updatedAt(code.getUpdatedAt())
                .build();
    }

    private String detectLanguageFromFileName(String fileName) {
        if (fileName == null) return "JAVA";
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".py")) return "PYTHON";
        if (lower.endsWith(".js") || lower.endsWith(".jsx") || lower.endsWith(".ts") || lower.endsWith(".tsx")) return "JAVASCRIPT";
        if (lower.endsWith(".cpp") || lower.endsWith(".c") || lower.endsWith(".hpp")) return "CPP";
        if (lower.endsWith(".go")) return "GO";
        if (lower.endsWith(".rs")) return "RUST";
        return "JAVA";
    }
}
