package com.aicoderreviewer.backend.service;

import com.aicoderreviewer.backend.dto.SavedCodeDTO;
import com.aicoderreviewer.backend.dto.SavedCodeRequest;
import com.aicoderreviewer.backend.model.SavedCode;
import com.aicoderreviewer.backend.user.Role;
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

    public SavedCodeDTO saveCode(String email, SavedCodeRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseGet(() -> userRepository.save(User.builder()
                                .firstName("Developer")
                                .lastName("User")
                                .email(email != null && !email.isBlank() ? email : "developer@domain.com")
                                .password("password123")
                                .role(Role.USER)
                                .build())));

        String language = request.getLanguage();
        if (language == null || language.isBlank()) {
            language = detectLanguageFromFileName(request.getFileName());
        }

        String fileName = (request.getFileName() != null && !request.getFileName().isBlank())
                ? request.getFileName()
                : "Main.java";

        String title = (request.getTitle() != null && !request.getTitle().isBlank())
                ? request.getTitle()
                : fileName;

        SavedCode savedCode = SavedCode.builder()
                .title(title)
                .fileName(fileName)
                .language(language)
                .code(request.getCode() != null ? request.getCode() : "")
                .user(user)
                .build();

        SavedCode saved = savedCodeRepository.save(savedCode);
        return mapToDTO(saved);
    }

    public List<SavedCodeDTO> getUserSavedCodes(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return savedCodeRepository.findAll()
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }
        return savedCodeRepository.findByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SavedCodeDTO getSavedCodeById(Long id, String email) {
        SavedCode savedCode = savedCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Saved code not found with ID: " + id));
        return mapToDTO(savedCode);
    }

    public void deleteSavedCode(Long id, String email) {
        SavedCode savedCode = savedCodeRepository.findById(id)
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
