package backend.controller;

import backend.model.Problem;
import backend.repository.ProblemRepository;
import backend.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProblemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProblemRepository problemRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        problemRepository.deleteAll();
        // Default: token is invalid unless specified
        when(jwtUtil.isTokenValid(anyString())).thenReturn(false);
    }

    private void mockValidToken() {
        when(jwtUtil.isTokenValid(anyString())).thenReturn(true);
        when(jwtUtil.extractEmail(anyString())).thenReturn("test@example.com");
        when(jwtUtil.extractName(anyString())).thenReturn("Test User");
    }

    @Test
    public void testGetAllProblems_Success() throws Exception {
        // Create test data
        Problem p1 = new Problem("Two Sum", "Easy", "Arrays");
        Problem p2 = new Problem("Reverse String", "Easy", "Strings");
        problemRepository.save(p1);
        problemRepository.save(p2);

        // Test GET /api/problems
        mockMvc.perform(get("/api/problems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", equalTo("Two Sum")))
                .andExpect(jsonPath("$[1].title", equalTo("Reverse String")));
    }

    @Test
    public void testGetProblemById_Success() throws Exception {
        Problem p = new Problem("Two Sum", "Easy", "Arrays");
        Problem saved = problemRepository.save(p);

        mockMvc.perform(get("/api/problems/{id}", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", equalTo("Two Sum")))
                .andExpect(jsonPath("$.difficulty", equalTo("Easy")));
    }

    @Test
    public void testGetProblemById_NotFound() throws Exception {
        mockMvc.perform(get("/api/problems/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateProblem_WithoutToken_Unauthorized() throws Exception {
        Problem p = new Problem("New Problem", "Medium", "DP");
        
        mockMvc.perform(post("/api/problems")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", equalTo("Authentication required")));
    }

    @Test
    public void testCreateProblem_WithValidToken_Success() throws Exception {
        mockValidToken();
        Problem p = new Problem("New Problem", "Medium", "DP");
        
        // Mock JWT token in Authorization header
        String token = "Bearer valid_jwt_token";
        
        mockMvc.perform(post("/api/problems")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", equalTo("New Problem")))
                .andExpect(jsonPath("$.difficulty", equalTo("Medium")));
    }

    @Test
    public void testDeleteProblem_WithoutToken_Unauthorized() throws Exception {
        Problem p = new Problem("To Delete", "Hard", "Graphs");
        Problem saved = problemRepository.save(p);

        mockMvc.perform(delete("/api/problems/{id}", saved.getId()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", equalTo("Authentication required")));
    }

    @Test
    public void testDeleteProblem_WithValidToken_Success() throws Exception {
        mockValidToken();
        Problem p = new Problem("To Delete", "Hard", "Graphs");
        Problem saved = problemRepository.save(p);

        String token = "Bearer valid_jwt_token";

        mockMvc.perform(delete("/api/problems/{id}", saved.getId())
                .header("Authorization", token))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteProblem_NotFound() throws Exception {
        mockValidToken();
        String token = "Bearer valid_jwt_token";

        mockMvc.perform(delete("/api/problems/999")
                .header("Authorization", token))
                .andExpect(status().isNotFound());
    }
}
