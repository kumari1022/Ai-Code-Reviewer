package com.aicoderreviewer.backend.controller;

import com.aicoderreviewer.backend.entity.CodeFile;
import com.aicoderreviewer.backend.repository.CodeFileRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final CodeFileRepository repository;

    @GetMapping("/latest")
    public CodeFile getLatestReview() {

        return repository.findTopByOrderByIdDesc();
    }
}