package backend;

import backend.repository.ProblemListRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private ProblemListRepository problemListRepository;

    @Test
    void contextLoads() {
        assertThat(problemListRepository).isNotNull();
    }

    @Test
    void defaultProblemListIsSeeded() {
        assertThat(problemListRepository.findByNameIgnoreCase("Default")).isPresent();
    }
}
