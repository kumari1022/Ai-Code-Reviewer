package com.aicoderreviewer.backend.controller;

import com.aicoderreviewer.backend.entity.CodeFile;

import com.aicoderreviewer.backend.repository.CodeFileRepository;

import com.aicoderreviewer.backend.user.User;

import com.aicoderreviewer.backend.user.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

    private final UserRepository userRepository;

    private final CodeFileRepository codeFileRepository;

    @GetMapping("/users")
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    @GetMapping("/reviews")
    public List<CodeFile> getAllReviews() {

        return codeFileRepository.findAll();
    }

    @DeleteMapping("/review/{id}")
    public String deleteReview(

            @PathVariable Long id
    ) {

        codeFileRepository.deleteById(id);

        return "Review Deleted";
    }

    @GetMapping("/stats")
    public Map<String,Object> getStats() {

        Map<String,Object> stats =
                new HashMap<>();

        stats.put(
                "totalUsers",

                userRepository.count()
        );

        stats.put(
                "totalReviews",

                codeFileRepository.count()
        );

        return stats;
    }
}