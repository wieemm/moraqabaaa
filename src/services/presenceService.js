// src/services/presenceService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const presenceService = {
  // Enregistrer une présence
  create: async (presenceData) => {
    const response = await axios.post(`${API_BASE_URL}/suivis`, presenceData);
    return response.data;
  },

  // Récupérer l'historique d'un médecin
  getByMedecin: async (medecinId) => {
    const response = await axios.get(`${API_BASE_URL}/suivis/medecin/${medecinId}`);
    return response.data;
  },

  // Récupérer la présence du jour
  getTodayPresence: async (medecinId) => {
    const response = await axios.get(`${API_BASE_URL}/suivis/medecin/${medecinId}/today`);
    return response.data;
  },

  // Récupérer les statistiques
  getStats: async (medecinId) => {
    const response = await axios.get(`${API_BASE_URL}/suivis/medecin/${medecinId}/stats`);
    return response.data;
  }
};