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
    private String link;
    @Column(length = 4000)
    private String notes;
    private Long listId;
    private LocalDate solvedAt;

    public Problem() {}

    public Problem(String title, String difficulty, String topics) {
        this.title = title;
        this.difficulty = difficulty;
        this.topics = topics;
        this.solvedAt = LocalDate.now();
        this.listId = 1L;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getTopics() { return topics; }
    public void setTopics(String topics) { this.topics = topics; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getListId() { return listId; }
    public void setListId(Long listId) { this.listId = listId; }

    public LocalDate getSolvedAt() { return solvedAt; }
    public void setSolvedAt(LocalDate solvedAt) { this.solvedAt = solvedAt; }
}
