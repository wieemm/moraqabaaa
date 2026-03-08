package repository;

import ma.moraqaba.moraqaba.SuiviPresence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SuiviPresenceRepository extends JpaRepository<SuiviPresence, Long> {

    List<SuiviPresence> findByUtilisateurId(Long utilisateurId);

    @Query("SELECT s FROM SuiviPresence s WHERE s.utilisateur.id = :utilisateurId AND DATE(s.date) = DATE(:date)")
    SuiviPresence findByUtilisateurIdAndDate(@Param("utilisateurId") Long utilisateurId, @Param("date") Date date);
}