package backend.repository;

import backend.model.ProblemList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProblemListRepository extends JpaRepository<ProblemList, Long> {
    Optional<ProblemList> findByNameIgnoreCase(String name);
}