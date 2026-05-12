package backend.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Map;

@Component
public class JwtUtil {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String extractEmail(String token) {
        try {
            Map<String, Object> claims = extractAllClaims(token);
            return (String) claims.get("sub");
        } catch (Exception e) {
            return null;
        }
    }

    public String extractName(String token) {
        try {
            Map<String, Object> claims = extractAllClaims(token);
            return (String) claims.get("name");
        } catch (Exception e) {
            return "Dev User";
        }
    }

    public boolean isTokenValid(String token) {
        try {
            String[] parts = token.split("\\.");
            return parts.length == 3;
        } catch (Exception e) {
            return false;
        }
    }

    private Map<String, Object> extractAllClaims(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) {
                throw new JwtException("Invalid token format");
            }
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));
            return objectMapper.readValue(payloadJson, Map.class);
        } catch (Exception e) {
            throw new JwtException("Could not parse token payload", e);
        }
    }
}
