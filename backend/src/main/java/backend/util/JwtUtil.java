package backend.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret:your-secret-key-change-in-production}")
    private String jwtSecret;

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractName(String token) {
        return (String) extractAllClaims(token).get("name");
    }

    public boolean isTokenValid(String token) {
        try {
            String[] parts = token.split("\\.");
            return parts.length == 3;
        } catch (Exception e) {
            return false;
        }
    }

    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        // For development: Parse the Google ID token payload without full signature verification.
        // In a production environment, you MUST verify the signature against Google's public keys.
        String[] parts = token.split("\\.");
        if (parts.length < 2) {
            throw new JwtException("Invalid token format");
        }
        
        return Jwts.parser()
                .unsecured()
                .build()
                .parseUnsecuredClaims(parts[0] + "." + parts[1] + ".")
                .getPayload();
    }
}
