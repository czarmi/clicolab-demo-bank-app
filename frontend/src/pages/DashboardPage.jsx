import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import CurrencyWidget from '../components/CurrencyWidget';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        setError('Sesja wygasla, zaloguj sie ponownie');
        logout();
        setTimeout(() => navigate('/login'), 1500);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Wczytywanie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  const displayName = user?.fullName || user?.email || 'Uzytkowniku';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-clicolab-primary text-white px-6 py-4 flex items-center justify-between shadow">
        <h1 className="text-lg font-bold tracking-wide">CLICOLAB-DEMO-BANK-APP</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
        >
          Wyloguj
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold text-clicolab-dark mb-2">
                Witaj {displayName} w demo Bank CLICOLAB
              </h2>
              <p className="text-gray-500 text-sm">
                Zalogowano jako <span className="font-medium">{user?.email}</span>{' '}
                ({user?.provider === 'saml' ? 'logowanie SSO / SAML' : 'logowanie lokalne'})
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="bg-blue-50 rounded-xl p-5">
                  <p className="text-sm text-gray-500">Saldo konta</p>
                  <p className="text-2xl font-bold text-clicolab-dark mt-1">12 480,50 PLN</p>
                </div>
                <div className="bg-green-50 rounded-xl p-5">
                  <p className="text-sm text-gray-500">Ostatnia transakcja</p>
                  <p className="text-2xl font-bold text-clicolab-dark mt-1">-320,00 PLN</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-5">
                  <p className="text-sm text-gray-500">Status konta</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">Aktywne</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <CurrencyWidget />
          </div>
        </div>
      </main>
    </div>
  );
}