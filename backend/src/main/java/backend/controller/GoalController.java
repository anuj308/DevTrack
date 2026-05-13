package backend.controller;

import backend.model.Goal;
import backend.repository.GoalRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalRepository goalRepository;

    public GoalController(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    @GetMapping
    public ResponseEntity<List<Goal>> list(HttpServletRequest request) {
        // JWT token is optional for GET requests
        return ResponseEntity.ok(goalRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Goal g, HttpServletRequest request) {
        // Check for JWT token
        String userEmail = (String) request.getAttribute("userEmail");
        if (userEmail == null) {
            return ResponseEntity.status(401).body("{\"error\": \"Authentication required\"}");
        }
        
        if (g.getListName() == null || g.getListName().isBlank()) {
            g.setListName("Goals");
        }

        Goal saved = goalRepository.save(g);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Goal> get(@PathVariable long id) {
        return goalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id, HttpServletRequest request) {
        // Check for JWT token
        String userEmail = (String) request.getAttribute("userEmail");
        if (userEmail == null) {
            return ResponseEntity.status(401).body("{\"error\": \"Authentication required\"}");
        }
        
        if (!goalRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        goalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> updateCompletion(@PathVariable long id,
                                              @RequestBody Map<String, Boolean> payload,
                                              HttpServletRequest request) {
        String userEmail = (String) request.getAttribute("userEmail");
        if (userEmail == null) {
            return ResponseEntity.status(401).body("{\"error\": \"Authentication required\"}");
        }

        Goal goal = goalRepository.findById(id).orElse(null);
        if (goal == null) {
            return ResponseEntity.notFound().build();
        }

        Boolean completed = payload.get("completed");
        if (completed != null) {
            goal.setCompleted(completed);
        }

        Goal saved = goalRepository.save(goal);
        return ResponseEntity.ok(saved);
    }
}

