package backend.controller;

import backend.model.Goal;
import backend.repository.GoalRepository;
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

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class GoalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private GoalRepository goalRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        goalRepository.deleteAll();
        // Default: token is invalid unless specified
        when(jwtUtil.isTokenValid(anyString())).thenReturn(false);
    }

    private void mockValidToken() {
        when(jwtUtil.isTokenValid(anyString())).thenReturn(true);
        when(jwtUtil.extractEmail(anyString())).thenReturn("test@example.com");
        when(jwtUtil.extractName(anyString())).thenReturn("Test User");
    }

    @Test
    public void testGetAllGoals_Success() throws Exception {
        Goal g1 = new Goal("Complete 50 LeetCode problems", LocalDate.of(2026, 6, 30));
        Goal g2 = new Goal("Learn Spring Boot", LocalDate.of(2026, 7, 15));
        goalRepository.save(g1);
        goalRepository.save(g2);

        mockMvc.perform(get("/api/goals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", equalTo("Complete 50 LeetCode problems")))
                .andExpect(jsonPath("$[1].title", equalTo("Learn Spring Boot")));
    }

    @Test
    public void testGetGoalById_Success() throws Exception {
        Goal g = new Goal("Master React", LocalDate.of(2026, 8, 31));
        Goal saved = goalRepository.save(g);

        mockMvc.perform(get("/api/goals/{id}", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", equalTo("Master React")))
                .andExpect(jsonPath("$.completed", equalTo(false)));
    }

    @Test
    public void testGetGoalById_NotFound() throws Exception {
        mockMvc.perform(get("/api/goals/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateGoal_WithoutToken_Unauthorized() throws Exception {
        Goal g = new Goal("New Goal", LocalDate.of(2026, 12, 31));

        mockMvc.perform(post("/api/goals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(g)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", equalTo("Authentication required")));
    }

    @Test
    public void testCreateGoal_WithValidToken_Success() throws Exception {
        mockValidToken();
        Goal g = new Goal("Learn Docker", LocalDate.of(2026, 9, 30));

        String token = "Bearer valid_jwt_token";

        mockMvc.perform(post("/api/goals")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token)
                .content(objectMapper.writeValueAsString(g)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", equalTo("Learn Docker")))
                .andExpect(jsonPath("$.completed", equalTo(false)));
    }

    @Test
    public void testDeleteGoal_WithoutToken_Unauthorized() throws Exception {
        Goal g = new Goal("Delete Me", LocalDate.of(2026, 10, 31));
        Goal saved = goalRepository.save(g);

        mockMvc.perform(delete("/api/goals/{id}", saved.getId()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", equalTo("Authentication required")));
    }

    @Test
    public void testDeleteGoal_WithValidToken_Success() throws Exception {
        mockValidToken();
        Goal g = new Goal("Delete Me", LocalDate.of(2026, 10, 31));
        Goal saved = goalRepository.save(g);

        String token = "Bearer valid_jwt_token";

        mockMvc.perform(delete("/api/goals/{id}", saved.getId())
                .header("Authorization", token))
                .andExpect(status().isNoContent());
    }
}
