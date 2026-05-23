package com.aicoderreviewer.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JWTService {

    private static final String SECRET =

            "mysecuresecretkeymysecuresecretkey123456";

    private final Key key =

            Keys.hmacShaKeyFor(
                    SECRET.getBytes()
            );

    public String generateToken(
            String email
    ) {

        return Jwts.builder()

                .setSubject(email)

                .setIssuedAt(new Date())

                .setExpiration(

                        new Date(
                                System.currentTimeMillis()
                                        + 1000 * 60 * 60
                        )
                )

                .signWith(
                        key,
                        SignatureAlgorithm.HS256
                )

                .compact();
    }

    public String extractEmail(
            String token
    ) {

        return extractClaims(token)
                .getSubject();
    }

    private Claims extractClaims(
            String token
    ) {

        return Jwts.parserBuilder()

                .setSigningKey(key)

                .build()

                .parseClaimsJws(token)

                .getBody();
    }

    public boolean isTokenValid(
            String token
    ) {

        try {

            extractClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }
}