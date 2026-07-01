import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest, samlLoginUrl } from '../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginRequest(email, password);
      localStorage.setItem('clicolab_token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Logowanie nie powiodlo sie');
    } finally {
      setLoading(false);
    }
  };

  const handleSamlLogin = () => {
    window.location.href = samlLoginUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-clicolab-dark to-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-clicolab-primary px-8 py-6 text-center">
          <h1 className="text-white text-2xl font-bold tracking-wide">CLICOLAB-DEMO-BANK-APP</h1>
          <p className="text-blue-100 text-sm mt-1">Panel logowania</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres e-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clicolab-primary focus:border-transparent"
                placeholder="jan.kowalski@clicolab.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Haslo</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clicolab-primary focus:border-transparent"
                placeholder="********"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300" />
                Zapamietaj mnie
              </label>
              <a href="#" className="text-clicolab-primary hover:underline">Nie pamietam hasla</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-clicolab-primary text-white font-semibold rounded-lg py-2.5 hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? 'Logowanie...' : 'Zaloguj sie'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-400 uppercase">lub</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            onClick={handleSamlLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Zaloguj sie przez SSO (SAML)
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Nie masz konta?{' '}
            <Link to="/register" className="text-clicolab-primary font-medium hover:underline">
              Zarejestruj sie
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
