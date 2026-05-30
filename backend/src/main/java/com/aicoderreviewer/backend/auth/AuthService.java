package com.aicoderreviewer.backend.auth;

import com.aicoderreviewer.backend.security.JWTService;

import com.aicoderreviewer.backend.user.*;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;

    private final PasswordEncoder passwordEncoder;

    private final JWTService jwtService;

    public String register(
            RegisterRequest request
    ) {

        User user = User.builder()

                .firstName(
                        request.getFirstName()
                )

                .lastName(
                        request.getLastName()
                )

                .email(request.getEmail())

                .password(

                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .role(Role.USER)

                .build();

        repository.save(user);

        return "User registered successfully";
    }

    public String login(
            LoginRequest request
    ) {

        User user = repository.findByEmail(
                request.getEmail()
        ).orElseThrow(() ->

                new RuntimeException(
                        "User not found"
                )
        );

        if (!passwordEncoder.matches(

                request.getPassword(),

                user.getPassword()

        )) {

            throw new RuntimeException(
                    "Invalid password"
            );
        }

        return jwtService.generateToken(
                user.getEmail()
        );
    }
}