package backend.controller;

import backend.model.Problem;
import backend.repository.ProblemRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemRepository problemRepository;

    public ProblemController(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @GetMapping
    public ResponseEntity<List<Problem>> list(HttpServletRequest request) {
        // JWT token is optional for GET requests
        return ResponseEntity.ok(problemRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Problem p, HttpServletRequest request) {
        // Check for JWT token
        String userEmail = (String) request.getAttribute("userEmail");
        if (userEmail == null) {
            return ResponseEntity.status(401).body("{\"error\": \"Authentication required\"}");
        }
        
        Problem saved = problemRepository.save(p);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Problem> get(@PathVariable Long id) {
        return problemRepository.findById(id)
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
        
        if (!problemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        problemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
