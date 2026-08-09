package com.aicoderreviewer.backend.controller;

import com.aicoderreviewer.backend.dto.SavedCodeDTO;
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

    @PostMapping
    public ResponseEntity<SavedCodeDTO> saveCode(@RequestBody SavedCodeDTO dto, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(savedCodeService.saveCode(email, dto));
    }

    @GetMapping
    public ResponseEntity<List<SavedCodeDTO>> getUserSavedCodes(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(savedCodeService.getUserSavedCodes(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavedCodeDTO> getSavedCodeById(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(savedCodeService.getSavedCodeById(id, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSavedCode(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        savedCodeService.deleteSavedCode(id, email);
        return ResponseEntity.noContent().build();
    }
}
