package com.aicoderreviewer.backend.github;

import org.springframework.stereotype.Service;

@Service
public class GitHubService {

    public String analyzeRepository(String repoUrl) {

        return "Repository analysis started for: "
                + repoUrl;
    }
}