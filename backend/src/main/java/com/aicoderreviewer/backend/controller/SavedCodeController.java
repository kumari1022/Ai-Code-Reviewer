package com.aicoderreviewer.backend.controller;

import com.aicoderreviewer.backend.dto.SavedCodeDTO;
import com.aicoderreviewer.backend.dto.SavedCodeRequest;
import com.aicoderreviewer.backend.security.JWTService;
import com.aicoderreviewer.backend.service.SavedCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/codes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SavedCodeController {

    private final SavedCodeService savedCodeService;
    private final JWTService jwtService;

    @PostMapping
    public ResponseEntity<SavedCodeDTO> saveCode(
            @RequestBody SavedCodeRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(savedCodeService.saveCode(email, request));
    }

    @GetMapping
    public ResponseEntity<List<SavedCodeDTO>> getUserSavedCodes(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(savedCodeService.getUserSavedCodes(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavedCodeDTO> getSavedCodeById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(savedCodeService.getSavedCodeById(id, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSavedCode(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmail(authHeader);
        savedCodeService.deleteSavedCode(id, email);
        return ResponseEntity.noContent().build();
    }

    private String extractEmail(String authHeader) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null && !auth.getName().isBlank() 
                    && !"anonymousUser".equalsIgnoreCase(auth.getName())) {
                return auth.getName();
            }
        } catch (Exception e) {
            // Ignore security context lookup failure
        }

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String email = jwtService.extractEmail(token);
                if (email != null && !email.isBlank()) {
                    return email;
                }
            } catch (Exception e) {
                // Token parse fallback
            }
        }
        return "developer@domain.com";
    }
}
