package com.aicoderreviewer.backend.github;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class GitHubController {

    private final GitHubService gitHubService;

    @PostMapping("/analyze")
    public String analyze(
            @RequestBody String repoUrl
    ) {

        return gitHubService
                .analyzeRepository(repoUrl);
    }
}