package com.aicoderreviewer.backend.controller;

import com.aicoderreviewer.backend.dto.SavedCodeDTO;
import com.aicoderreviewer.backend.dto.SavedCodeRequest;
import com.aicoderreviewer.backend.security.JWTService;
import com.aicoderreviewer.backend.service.SavedCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmail(authentication, authHeader);
        return ResponseEntity.ok(savedCodeService.saveCode(email, request));
    }

    @GetMapping
    public ResponseEntity<List<SavedCodeDTO>> getUserSavedCodes(
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmail(authentication, authHeader);
        return ResponseEntity.ok(savedCodeService.getUserSavedCodes(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavedCodeDTO> getSavedCodeById(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmail(authentication, authHeader);
        return ResponseEntity.ok(savedCodeService.getSavedCodeById(id, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSavedCode(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmail(authentication, authHeader);
        savedCodeService.deleteSavedCode(id, email);
        return ResponseEntity.noContent().build();
    }

    private String extractEmail(Authentication authentication, String authHeader) {
        if (authentication != null && authentication.getName() != null 
                && !authentication.getName().isBlank() 
                && !"anonymousUser".equals(authentication.getName())) {
            return authentication.getName();
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
