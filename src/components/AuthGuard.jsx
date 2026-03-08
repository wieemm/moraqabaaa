// src/components/AuthGuard.jsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children, allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Si pas authentifié, rediriger vers login
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Vérifier les rôles autorisés
      if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Rediriger vers le dashboard approprié selon le rôle
        switch(user?.role) {
          case 'MEDECIN':
            router.push('/medecin/dashboard');
            break;
          case 'DIRECTEUR':
            router.push('/directeur/dashboard');
            break;
          case 'DIRECTEUR_NATIONAL':
            router.push('/directeur-national/dashboard');
            break;
          default:
            router.push('/login');
        }
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-xl text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}