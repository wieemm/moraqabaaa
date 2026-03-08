'use client';

import { useEffect, useState } from 'react';
import StatCard from '../../src/components/StatCard';
import { statisticsService } from '../../src/services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUtilisateurs: 0,
    totalEtablissements: 0,
    roleCount: {},
    loading: true,
  });

  const [etablissementStats, setEtablissementStats] = useState({});

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    try {
      const [dashStats, etabStats] = await Promise.all([
        statisticsService.getDashboardStats(),
        statisticsService.getUsersByEtablissement(),
      ]);

      setStats({ ...dashStats, loading: false });
      setEtablissementStats(etabStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setStats({ ...stats, loading: false });
    }
  };

  if (stats.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Chargement des statistiques...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin Régional</h1>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
        <StatCard
          title="Total Utilisateurs"
          value={stats.totalUtilisateurs}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Établissements"
          value={stats.totalEtablissements}
          icon="🏢"
          color="green"
        />
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">👤</span>
            Utilisateurs par Rôle
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.roleCount).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-semibold text-gray-700">{role}</span>
                  {role.toLowerCase().includes('medecin') && <span className="ml-2">👨‍⚕️</span>}
                  {role.toLowerCase().includes('directeur') && <span className="ml-2">👔</span>}
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Statistiques
          </h2>
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {stats.totalUtilisateurs} utilisateur(s) répartis dans {stats.totalEtablissements} établissement(s)
            </p>
          </div>
        </div>
      </div>

    
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🏥</span>
          Utilisateurs par Établissement
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Établissement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Médecins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Directeurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Autres
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(etablissementStats).map(([etabNom, counts]) => (
                <tr key={etabNom} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {etabNom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                      {counts.total}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      👨‍⚕️ {counts.medecins}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                      👔 {counts.directeurs}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                      {counts.autres}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

   
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/utilisateurs"
            className="flex items-center p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all"
          >
            <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mr-4">
              👥
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Gérer les Utilisateurs</h3>
              <p className="text-sm text-gray-600">Ajouter, modifier ou supprimer</p>
            </div>
          </a>

          <a
            href="/etablissements"
            className="flex items-center p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all"
          >
            <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mr-4">
              🏢
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Gérer les Établissements</h3>
              <p className="text-sm text-gray-600">Ajouter, modifier ou supprimer</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}