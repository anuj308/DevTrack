package backend.config;

import backend.model.ProblemList;
import backend.repository.ProblemListRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedDefaultList(ProblemListRepository problemListRepository) {
        return args -> {
            if (problemListRepository.findByNameIgnoreCase("Default").isEmpty()) {
                problemListRepository.save(new ProblemList("Default"));
            }
        };
    }
}