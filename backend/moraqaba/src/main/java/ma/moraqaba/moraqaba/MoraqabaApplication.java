package ma.moraqaba.moraqaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "repository")
@ComponentScan(basePackages = {
		"ma.moraqaba.moraqaba",
		"controller",
		"service",
		"repository"
})
public class MoraqabaApplication {
	public static void main(String[] args) {
		SpringApplication.run(MoraqabaApplication.class, args);
	}
}