package backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String difficulty;
    private String topics;
    private LocalDate solvedAt;

    public Problem() {}

    public Problem(String title, String difficulty, String topics) {
        this.title = title;
        this.difficulty = difficulty;
        this.topics = topics;
        this.solvedAt = LocalDate.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getTopics() { return topics; }
    public void setTopics(String topics) { this.topics = topics; }

    public LocalDate getSolvedAt() { return solvedAt; }
    public void setSolvedAt(LocalDate solvedAt) { this.solvedAt = solvedAt; }
}
