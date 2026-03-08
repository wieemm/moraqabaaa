'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Ne pas afficher la navbar sur la page de login
  if (pathname === '/login') return null;

  const getNavLinks = () => {
    if (!user) return [];

    switch(user.role) {
      case 'MEDECIN':
        return [
          { href: '/medecin/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/medecin/checkin', label: 'Check-in', icon: '📸' },
          { href: '/medecin/historique', label: 'Historique', icon: '📅' },
        ];
      case 'DIRECTEUR':
        return [
          { href: '/directeur/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/utilisateurs', label: 'Utilisateurs', icon: '👥' },
          { href: '/etablissements', label: 'Établissements', icon: '🏢' },
        ];
      case 'DIRECTEUR_NATIONAL':
        return [
          { href: '/directeur-national/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/dashboard', label: 'Statistiques', icon: '📈' },
          { href: '/utilisateurs', label: 'Utilisateurs', icon: '👥' },
          { href: '/etablissements', label: 'Établissements', icon: '🏢' },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={user ? `/${user.role.toLowerCase()}/dashboard` : '/login'} className="text-xl font-bold">
            Moraqaba
          </Link>

          {user && (
            <>
              <div className="flex space-x-4">
                {getNavLinks().map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      pathname === link.href
                        ? 'bg-blue-700 font-semibold'
                        : 'hover:bg-blue-500'
                    }`}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{user.username}</span>
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                    {user.photo ? (
                      <img src={user.photo} alt={user.username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      '👤'
                    )}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-md text-sm transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}