
'use client';

import { useEffect, useState } from 'react';
import { utilisateurService, etablissementService } from '../../src/services/api'; 

export default function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchCin, setSearchCin] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    cin: '',
    tel: '',
    password: '',
    role: 'MEDECIN',
    photo: '',
    dateSaisie: new Date().toISOString().split('T')[0],
    etablissement: null,
   
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchCin, utilisateurs]);

  const loadData = async () => {
    try {
      const [usersData, etablData] = await Promise.all([
        utilisateurService.getAll(),
        etablissementService.getAll(),
       
      ]);
      setUtilisateurs(usersData);
      setFilteredUsers(usersData);
      setEtablissements(etablData);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des données');
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchCin.trim()) {
      setFilteredUsers(utilisateurs);
    } else {
      const filtered = utilisateurs.filter(user =>
        user.cin && user.cin.toLowerCase().includes(searchCin.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        username: formData.username,
        cin: formData.cin,
        tel: formData.tel,
        password: formData.password,
        role: formData.role,
        photo: formData.photo || null,
        dateSaisie: formData.dateSaisie,
        etablissement: formData.etablissement ? { id: parseInt(formData.etablissement) } : null,
     
      };

      if (editingUser) {
        if (!formData.password) {
          delete dataToSend.password;
        }
        await utilisateurService.update(editingUser.id, dataToSend);
        alert('✅ Utilisateur modifié avec succès !');
      } else {
        await utilisateurService.create(dataToSend);
        alert('✅ Utilisateur créé avec succès !');
      }
      
      setShowModal(false);
      setEditingUser(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      cin: user.cin || '',
      tel: user.tel || '',
      password: '',
      role: user.role || 'MEDECIN',
      photo: user.photo || '',
      dateSaisie: user.dateSaisie || new Date().toISOString().split('T')[0],
      etablissement: user.etablissement?.id || null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await utilisateurService.delete(id);
        alert('✅ Utilisateur supprimé avec succès !');
        loadData();
      } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      cin: '',
      tel: '',
      password: '',
      role: 'MEDECIN',
      photo: '',
      dateSaisie: new Date().toISOString().split('T')[0],
      etablissement: null,
    });
  };

  const openAddModal = () => {
    setEditingUser(null);
    resetForm();
    setShowModal(true);
  };

  const formatRole = (role) => {
    const roles = {
      'DIRECTEUR_NATIONAL': 'Directeur national',
      'DIRECTEUR': 'Directeur',
      'MEDECIN': 'Médecin',
      'CITOYEN': 'Citoyen'
    };
    return roles[role] || role;
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
      {}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-1">
            {filteredUsers.length} utilisateur(s) {searchCin && `trouvé(s) pour "${searchCin}"`}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          + Ajouter un utilisateur
        </button>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Rechercher par CIN
            </label>
            <input
              type="text"
              value={searchCin}
              onChange={(e) => setSearchCin(e.target.value)}
              placeholder="Entrez le CIN à rechercher..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {searchCin && (
            <button
              onClick={() => setSearchCin('')}
              className="mt-7 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Établissement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-mono text-xs">
                      {user.cin}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.tel}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'DIRECTEUR_NATIONAL' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'DIRECTEUR' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'MEDECIN' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.etablissement?.nom || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchCin ? (
              <div>
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl">Aucun utilisateur trouvé avec le CIN "{searchCin}"</p>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">👥</div>
                <p className="text-xl">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        )}
      </div>

      {}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingUser ? '✏️ Modifier l\'utilisateur' : '+ Ajouter un utilisateur'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CIN *
                  </label>
                  <input
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: AB123456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="text"
                    name="tel"
                    value={formData.tel}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: 0612345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe {editingUser ? '(laisser vide pour ne pas changer)' : '*'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DIRECTEUR_NATIONAL">Directeur national</option>
                    <option value="DIRECTEUR">Directeur</option>
                    <option value="MEDECIN">Médecin</option>
                    <option value="CITOYEN">Citoyen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Saisie
                  </label>
                  <input
                    type="date"
                    name="dateSaisie"
                    value={formData.dateSaisie}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Établissement
                  </label>
                  <select
                    name="etablissement"
                    value={formData.etablissement || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Aucun --</option>
                    {etablissements.map((etab) => (
                      <option key={etab.id} value={etab.id}>
                        {etab.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo (URL)
                  </label>
                  <input
                    type="text"
                    name="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                    placeholder="URL de la photo (optionnel)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingUser ? '💾 Modifier' : '+ Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}