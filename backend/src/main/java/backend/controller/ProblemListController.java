package backend.controller;

import backend.model.ProblemList;
import backend.repository.ProblemListRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lists")
public class ProblemListController {

    private final ProblemListRepository problemListRepository;

    public ProblemListController(ProblemListRepository problemListRepository) {
        this.problemListRepository = problemListRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProblemList>> list() {
        return ResponseEntity.ok(problemListRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemList> get(@PathVariable Long id) {
        return problemListRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "").trim();
        if (name.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "List name is required"));
        }

        return problemListRepository.findByNameIgnoreCase(name)
                .<ResponseEntity<?>>map(existing -> ResponseEntity.status(HttpStatus.CONFLICT).body(existing))
                .orElseGet(() -> ResponseEntity.ok(problemListRepository.save(new ProblemList(name))));
    }
}