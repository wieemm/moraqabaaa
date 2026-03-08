// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== UTILISATEURS ====================
export const utilisateurService = {
  getAll: async () => {
    const response = await api.get('/utilisateurs');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/utilisateurs/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post('/utilisateurs', userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/utilisateurs/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/utilisateurs/${id}`);
    return true;
  },
};

// ==================== ETABLISSEMENTS ====================
export const etablissementService = {
  getAll: async () => {
    const response = await api.get('/etablissements');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/etablissements/${id}`);
    return response.data;
  },

  create: async (etablissementData) => {
    const response = await api.post('/etablissements', etablissementData);
    return response.data;
  },

  update: async (id, etablissementData) => {
    const response = await api.put(`/etablissements/${id}`, etablissementData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/etablissements/${id}`);
    return true;
  },
};

// ==================== POSTES ====================
// AJOUTEZ CE SERVICE
export const posteService = {
  getAll: async () => {
    const response = await api.get('/postes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/postes/${id}`);
    return response.data;
  },

  create: async (posteData) => {
    const response = await api.post('/postes', posteData);
    return response.data;
  },

  update: async (id, posteData) => {
    const response = await api.put(`/postes/${id}`, posteData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/postes/${id}`);
    return true;
  },
};

// ==================== STATISTIQUES ====================
export const statisticsService = {
  getDashboardStats: async () => {
    try {
      const [users, etablissements, postes] = await Promise.all([
        api.get('/utilisateurs'),
        api.get('/etablissements'),
        api.get('/postes').catch(() => ({ data: [] })) // Au cas où les postes n'existent pas
      ]);

      // Compter par rôle
      const roleCount = {};
      users.data.forEach(user => {
        const role = user.role || 'NON_DEFINI';
        roleCount[role] = (roleCount[role] || 0) + 1;
      });

      return {
        totalUtilisateurs: users.data.length,
        totalEtablissements: etablissements.data.length,
        totalPostes: postes.data.length || 0,
        roleCount,
        regionCount: {},
        loading: false,
      };
    } catch (error) {
      console.error('Erreur stats:', error);
      return {
        totalUtilisateurs: 0,
        totalEtablissements: 0,
        totalPostes: 0,
        roleCount: {},
        regionCount: {},
        loading: false,
      };
    }
  },

  getUsersByEtablissement: async () => {
    try {
      const [users, etablissements] = await Promise.all([
        api.get('/utilisateurs'),
        api.get('/etablissements')
      ]);
      
      const stats = {};
      etablissements.data.forEach(etab => {
        stats[etab.nom] = { total: 0, medecins: 0, directeurs: 0, autres: 0 };
      });
      
      users.data.forEach(user => {
        if (user.etablissement) {
          const etabNom = user.etablissement.nom;
          if (stats[etabNom]) {
            stats[etabNom].total++;
            
            const role = user.role ? user.role.toLowerCase() : '';
            if (role.includes('medecin')) {
              stats[etabNom].medecins++;
            } else if (role.includes('directeur') || role.includes('manager')) {
              stats[etabNom].directeurs++;
            } else {
              stats[etabNom].autres++;
            }
          }
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Erreur:', error);
      return {};
    }
  },

  getEtablissementsByRegion: async () => {
    return {};
  },
};

export default api;