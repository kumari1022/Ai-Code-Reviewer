package com.aicoderreviewer.backend.controller;

import com.aicoderreviewer.backend.entity.CodeFile;
import com.aicoderreviewer.backend.repository.CodeFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReviewController {

    private final CodeFileRepository repository;

    @GetMapping("/latest")
    public CodeFile getLatestReview() {
        return repository.findTopByOrderByIdDesc();
    }

    @GetMapping("/{id}")
    public CodeFile getReviewById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow();
    }

    @GetMapping("/all")
    public List<CodeFile> getAllReviews() {
        return repository.findAll();
    }
}