import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../services/authService';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Hasla nie sa identyczne');
      return;
    }

    setLoading(true);
    try {
      await registerRequest(email, password, fullName);
      setSuccess('Konto zostalo utworzone. Mozesz sie teraz zalogowac.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Rejestracja nie powiodla sie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-clicolab-dark to-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-clicolab-primary px-8 py-6 text-center">
          <h1 className="text-white text-2xl font-bold tracking-wide">CLICOLAB-DEMO-BANK-APP</h1>
          <p className="text-blue-100 text-sm mt-1">Rejestracja nowego konta</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imie i nazwisko</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clicolab-primary focus:border-transparent"
                placeholder="Jan Kowalski"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Powtorz haslo</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clicolab-primary focus:border-transparent"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-clicolab-primary text-white font-semibold rounded-lg py-2.5 hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? 'Tworzenie konta...' : 'Zarejestruj sie'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Masz juz konto?{' '}
            <Link to="/login" className="text-clicolab-primary font-medium hover:underline">
              Zaloguj sie
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
