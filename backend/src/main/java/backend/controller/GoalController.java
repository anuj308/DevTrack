package backend.controller;

import backend.model.Goal;
import backend.repository.GoalRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        
        Goal saved = goalRepository.save(g);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Goal> get(@PathVariable Long id) {
        return goalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, HttpServletRequest request) {
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
}

