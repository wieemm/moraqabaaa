'use client';

import { useEffect, useState } from 'react';
import { etablissementService } from '../../src/services/api';

export default function EtablissementsPage() {
  const [etablissements, setEtablissements] = useState([]);
  const [filteredEtab, setFilteredEtab] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEtab, setEditingEtab] = useState(null);
  const [searchNom, setSearchNom] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
  });

  useEffect(() => {
    loadEtablissements();
  }, []);

  useEffect(() => {
    filterEtablissements();
  }, [searchNom, etablissements]);

  const loadEtablissements = async () => {
    try {
      const data = await etablissementService.getAll();
      setEtablissements(data);
      setFilteredEtab(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des établissements');
      setLoading(false);
    }
  };

  const filterEtablissements = () => {
    if (!searchNom.trim()) {
      setFilteredEtab(etablissements);
    } else {
      const filtered = etablissements.filter(etab =>
        etab.nom && etab.nom.toLowerCase().includes(searchNom.toLowerCase())
      );
      setFilteredEtab(filtered);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEtab) {
        await etablissementService.update(editingEtab.id, formData);
        alert('✅ Établissement modifié avec succès !');
      } else {
        await etablissementService.create(formData);
        alert('✅ Établissement créé avec succès !');
      }
      
      setShowModal(false);
      setEditingEtab(null);
      resetForm();
      loadEtablissements();
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (etab) => {
    setEditingEtab(etab);
    setFormData({
      nom: etab.nom,
      adresse: etab.adresse,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet établissement ?')) {
      try {
        await etablissementService.delete(id);
        alert('✅ Établissement supprimé avec succès !');
        loadEtablissements();
      } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      adresse: '',
    });
  };

  const openAddModal = () => {
    setEditingEtab(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Établissements</h1>
          <p className="text-gray-600 mt-1">
            {filteredEtab.length} établissement(s) {searchNom && `trouvé(s) pour "${searchNom}"`}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          + Ajouter un établissement
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Rechercher par Nom
            </label>
            <input
              type="text"
              value={searchNom}
              onChange={(e) => setSearchNom(e.target.value)}
              placeholder="Entrez le nom de l'établissement..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {searchNom && (
            <button
              onClick={() => setSearchNom('')}
              className="mt-7 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEtab.map((etab) => (
          <div key={etab.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-2 border-gray-100 hover:border-green-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center text-3xl">
                  🏢
                </div>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                  ID: {etab.id}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {etab.nom}
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-600 flex items-start">
                  <span className="mr-2 mt-1">📍</span>
                  <span>{etab.adresse}</span>
                </p>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(etab)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-md transition-colors font-semibold"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(etab.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-md transition-colors font-semibold"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEtab.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          {searchNom ? (
            <div>
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-xl mb-2">
                Aucun établissement trouvé avec le nom "{searchNom}"
              </p>
              <button
                onClick={() => setSearchNom('')}
                className="text-blue-600 hover:text-blue-800"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-gray-500 text-lg">Aucun établissement trouvé</p>
              <button
                onClick={openAddModal}
                className="mt-4 text-green-600 hover:text-green-800 font-semibold"
              >
                Créer le premier établissement
              </button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingEtab ? '✏️ Modifier l\'établissement' : '➕ Ajouter un établissement'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'établissement *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Préfecture de Oujda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse complète *
                  </label>
                  <textarea
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Avenue Mohammed V, Oujda"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEtab(null);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  {editingEtab ? '💾 Modifier' : '➕ Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}