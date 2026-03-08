package controller;

import ma.moraqaba.moraqaba.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.MoraqabaService;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class MoraqabaController {

    private final MoraqabaService service;

    public MoraqabaController(MoraqabaService service) {
        this.service = service;
    }

    // ==================== UTILISATEURS ====================
    @GetMapping("/utilisateurs")
    public List<Utilisateur> getUtilisateurs() {
        return service.getAllUtilisateurs();
    }

    @PostMapping("/utilisateurs")
    public Utilisateur addUtilisateur(@RequestBody Utilisateur u) {
        return service.saveUtilisateur(u);
    }

    @GetMapping("/utilisateurs/{id}")
    public Optional<Utilisateur> getUtilisateur(@PathVariable Long id) {
        return service.getUtilisateur(id);
    }

    @PutMapping("/utilisateurs/{id}")
    public Utilisateur updateUtilisateur(@PathVariable Long id, @RequestBody Utilisateur u) {
        u.setId(id);
        return service.saveUtilisateur(u);
    }

    @DeleteMapping("/utilisateurs/{id}")
    public void deleteUtilisateur(@PathVariable Long id) {
        service.deleteUtilisateur(id);
    }

    // ==================== ETABLISSEMENTS ====================
    @GetMapping("/etablissements")
    public List<Etablissement> getEtablissements() {
        return service.getAllEtablissements();
    }

    @PostMapping("/etablissements")
    public Etablissement addEtablissement(@RequestBody Etablissement e) {
        return service.saveEtablissement(e);
    }

    @GetMapping("/etablissements/{id}")
    public Optional<Etablissement> getEtablissement(@PathVariable Long id) {
        return service.getEtablissement(id);
    }

    @PutMapping("/etablissements/{id}")
    public Etablissement updateEtablissement(@PathVariable Long id, @RequestBody Etablissement e) {
        e.setId(id);
        return service.saveEtablissement(e);
    }

    @DeleteMapping("/etablissements/{id}")
    public void deleteEtablissement(@PathVariable Long id) {
        service.deleteEtablissement(id);
    }

    // ==================== SUIVIS ====================
    @GetMapping("/suivis")
    public List<SuiviPresence> getSuivis() {
        return service.getAllSuivis();
    }

    @PostMapping("/suivis")
    public SuiviPresence addSuivi(@RequestBody SuiviPresence s) {
        return service.saveSuivi(s);
    }

    @GetMapping("/suivis/{id}")
    public Optional<SuiviPresence> getSuivi(@PathVariable Long id) {
        return service.getSuivi(id);
    }

    @PutMapping("/suivis/{id}")
    public SuiviPresence updateSuivi(@PathVariable Long id, @RequestBody SuiviPresence s) {
        s.setId(id);
        return service.saveSuivi(s);
    }

    @DeleteMapping("/suivis/{id}")
    public void deleteSuivi(@PathVariable Long id) {
        service.deleteSuivi(id);
    }

    // ==================== CITOYENS ====================
    @GetMapping("/citoyens")
    public List<Citoyen> getCitoyens() {
        return service.getAllCitoyens();
    }

    @PostMapping("/citoyens")
    public Citoyen addCitoyen(@RequestBody Citoyen c) {
        return service.saveCitoyen(c);
    }

    @GetMapping("/citoyens/{id}")
    public Optional<Citoyen> getCitoyen(@PathVariable Long id) {
        return service.getCitoyen(id);
    }

    @PutMapping("/citoyens/{id}")
    public Citoyen updateCitoyen(@PathVariable Long id, @RequestBody Citoyen c) {
        c.setId(id);
        return service.saveCitoyen(c);
    }

    @DeleteMapping("/citoyens/{id}")
    public void deleteCitoyen(@PathVariable Long id) {
        service.deleteCitoyen(id);
    }

    // ==================== FEEDBACKS ====================
    @GetMapping("/feedbacks")
    public List<Feedback> getFeedbacks() {
        return service.getAllFeedbacks();
    }

    @PostMapping("/feedbacks")
    public Feedback addFeedback(@RequestBody Feedback f) {
        return service.saveFeedback(f);
    }

    @GetMapping("/feedbacks/{id}")
    public Optional<Feedback> getFeedback(@PathVariable Long id) {
        return service.getFeedback(id);
    }

    @PutMapping("/feedbacks/{id}")
    public Feedback updateFeedback(@PathVariable Long id, @RequestBody Feedback f) {
        f.setId(id);
        return service.saveFeedback(f);
    }

    @DeleteMapping("/feedbacks/{id}")
    public void deleteFeedback(@PathVariable Long id) {
        service.deleteFeedback(id);
    }

    // ==================== POSTES ====================
    @GetMapping("/postes")
    public List<Poste> getPostes() {
        return service.getAllPostes();
    }

    @PostMapping("/postes")
    public Poste addPoste(@RequestBody Poste p) {
        return service.savePoste(p);
    }

    @GetMapping("/postes/{id}")
    public Optional<Poste> getPoste(@PathVariable Long id) {
        return service.getPoste(id);
    }

    @PutMapping("/postes/{id}")
    public Poste updatePoste(@PathVariable Long id, @RequestBody Poste p) {
        p.setId(id);
        return service.savePoste(p);
    }

    @DeleteMapping("/postes/{id}")
    public void deletePoste(@PathVariable Long id) {
        service.deletePoste(id);
    }

    // ==================== AUTHENTIFICATION ====================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("=== TENTATIVE DE CONNEXION ===");
        System.out.println("Username: " + loginRequest.getUsername());
        System.out.println("Password: " + loginRequest.getPassword());

        Utilisateur user = service.findByUsername(loginRequest.getUsername());

        if (user == null) {
            System.out.println("❌ Utilisateur non trouvé");
            return ResponseEntity.status(401).body("Nom d'utilisateur ou mot de passe incorrect");
        }

        System.out.println("✅ Utilisateur trouvé: " + user.getUsername());
        System.out.println("Password en base: " + user.getPassword());
        System.out.println("Password reçu: " + loginRequest.getPassword());

        if (user.getPassword() != null && user.getPassword().equals(loginRequest.getPassword())) {
            System.out.println("✅ Mot de passe correct - Connexion réussie");
            // Ne pas renvoyer le mot de passe
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }

        System.out.println("❌ Mot de passe incorrect");
        return ResponseEntity.status(401).body("Nom d'utilisateur ou mot de passe incorrect");
    }

    // ==================== PRÉSENCES MÉDECIN ====================
    @GetMapping("/suivis/medecin/{medecinId}")
    public List<SuiviPresence> getSuivisByMedecin(@PathVariable Long medecinId) {
        return service.getSuivisByMedecin(medecinId);
    }

    @GetMapping("/suivis/medecin/{medecinId}/today")
    public ResponseEntity<?> getTodayPresence(@PathVariable Long medecinId) {
        SuiviPresence presence = service.getTodayPresence(medecinId);
        if (presence != null) {
            return ResponseEntity.ok(presence);
        }
        return ResponseEntity.ok(null);
    }

    @GetMapping("/suivis/medecin/{medecinId}/stats")
    public java.util.Map<String, Object> getPresenceStats(@PathVariable Long medecinId) {
        return service.getPresenceStats(medecinId);
    }
}

// Classe pour la requête de login
class LoginRequest {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}