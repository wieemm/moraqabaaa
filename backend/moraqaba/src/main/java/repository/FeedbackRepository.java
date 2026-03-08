package repository;

import ma.moraqaba.moraqaba.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {


    List<Feedback> findByUtilisateurId(Long utilisateurId);


    List<Feedback> findByCitoyenId(Long citoyenId);
}








































