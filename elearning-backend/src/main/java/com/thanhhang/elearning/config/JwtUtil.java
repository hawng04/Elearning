package com.thanhhang.elearning.config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private final String SECRET_STRING = "DayLaChuyenNganhCuaToiVaNoPhaiDuDaiDeBaoMat123456789";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());

    private final long EXPIRATION_TIME = 86400000;

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email) 
                .claim("role", role)
                .issuedAt(new Date()) 
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) 
                .signWith(key) 
                .compact();
    } 

    public String extractEmail (String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public String extractRole(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
