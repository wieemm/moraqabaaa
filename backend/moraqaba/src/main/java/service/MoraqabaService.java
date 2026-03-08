package service;

import ma.moraqaba.moraqaba.*;
import org.springframework.stereotype.Service;
import repository.*;

import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;

@Service
public class MoraqabaService {

    private final UtilisateurRepository utilisateurRepo;
    private final EtablissementRepository etablissementRepo;
    private final SuiviPresenceRepository suiviRepo;
    private final CitoyenRepository citoyenRepo;
    private final FeedbackRepository feedbackRepo;
    private final PosteRepository posteRepo;

    public MoraqabaService(UtilisateurRepository utilisateurRepo,
                           EtablissementRepository etablissementRepo,
                           SuiviPresenceRepository suiviRepo,
                           CitoyenRepository citoyenRepo,
                           FeedbackRepository feedbackRepo,
                           PosteRepository posteRepo) {
        this.utilisateurRepo = utilisateurRepo;
        this.etablissementRepo = etablissementRepo;
        this.suiviRepo = suiviRepo;
        this.citoyenRepo = citoyenRepo;
        this.feedbackRepo = feedbackRepo;
        this.posteRepo = posteRepo;
    }

    // ==================== UTILISATEURS ====================
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepo.findAll();
    }

    public Utilisateur saveUtilisateur(Utilisateur u) {
        return utilisateurRepo.save(u);
    }

    public Optional<Utilisateur> getUtilisateur(Long id) {
        return utilisateurRepo.findById(id);
    }

    public void deleteUtilisateur(Long id) {
        utilisateurRepo.deleteById(id);
    }

    // ==================== ETABLISSEMENTS ====================
    public List<Etablissement> getAllEtablissements() {
        return etablissementRepo.findAll();
    }

    public Etablissement saveEtablissement(Etablissement e) {
        return etablissementRepo.save(e);
    }

    public Optional<Etablissement> getEtablissement(Long id) {
        return etablissementRepo.findById(id);
    }

    public void deleteEtablissement(Long id) {
        etablissementRepo.deleteById(id);
    }

    // ==================== SUIVIS ====================
    public List<SuiviPresence> getAllSuivis() {
        return suiviRepo.findAll();
    }

    public SuiviPresence saveSuivi(SuiviPresence s) {
        return suiviRepo.save(s);
    }

    public Optional<SuiviPresence> getSuivi(Long id) {
        return suiviRepo.findById(id);
    }

    public void deleteSuivi(Long id) {
        suiviRepo.deleteById(id);
    }

    // ==================== CITOYENS ====================
    public List<Citoyen> getAllCitoyens() {
        return citoyenRepo.findAll();
    }

    public Citoyen saveCitoyen(Citoyen c) {
        return citoyenRepo.save(c);
    }

    public Optional<Citoyen> getCitoyen(Long id) {
        return citoyenRepo.findById(id);
    }

    public void deleteCitoyen(Long id) {
        citoyenRepo.deleteById(id);
    }

    // ==================== FEEDBACKS ====================
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepo.findAll();
    }

    public Feedback saveFeedback(Feedback f) {
        return feedbackRepo.save(f);
    }

    public Optional<Feedback> getFeedback(Long id) {
        return feedbackRepo.findById(id);
    }

    public void deleteFeedback(Long id) {
        feedbackRepo.deleteById(id);
    }

    // ==================== POSTES ====================
    public List<Poste> getAllPostes() {
        return posteRepo.findAll();
    }

    public Poste savePoste(Poste p) {
        return posteRepo.save(p);
    }

    public Optional<Poste> getPoste(Long id) {
        return posteRepo.findById(id);
    }

    public void deletePoste(Long id) {
        posteRepo.deleteById(id);
    }

    // ==================== AUTHENTIFICATION ====================
    public Utilisateur findByUsername(String username) {
        return utilisateurRepo.findByUsername(username);
    }

    // ==================== PRÉSENCES MÉDECIN ====================
    public List<SuiviPresence> getSuivisByMedecin(Long medecinId) {
        return suiviRepo.findByUtilisateurId(medecinId);
    }

    public SuiviPresence getTodayPresence(Long medecinId) {
        Date today = new Date();
        return suiviRepo.findByUtilisateurIdAndDate(medecinId, today);
    }

    public Map<String, Object> getPresenceStats(Long medecinId) {
        List<SuiviPresence> suivis = suiviRepo.findByUtilisateurId(medecinId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", suivis.size());
        stats.put("present", suivis.stream().filter(s -> "Présent".equals(s.getStatut())).count());
        stats.put("retard", suivis.stream().filter(s -> "Retard".equals(s.getStatut())).count());
        stats.put("absent", suivis.stream().filter(s -> "Absent".equals(s.getStatut())).count());

        return stats;
    }
}