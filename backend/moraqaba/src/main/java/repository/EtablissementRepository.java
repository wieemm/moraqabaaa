package repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ma.moraqaba.moraqaba.Etablissement;

@Repository
public interface EtablissementRepository extends JpaRepository<Etablissement, Long> {

    Etablissement findByNom(String nom);
}








































