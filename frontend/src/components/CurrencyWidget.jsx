import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getCurrentRates, getRateHistory } from '../services/currencyService';

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
  });
}

export default function CurrencyWidget() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  const today = new Date().toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [currentData, historyData] = await Promise.all([
          getCurrentRates(),
          getRateHistory(),
        ]);
        if (!isMounted) return;
        setCurrent(currentData);
        setHistory(
          historyData.map((h) => ({
            ...h,
            label: formatDate(h.date),
          }))
        );
      } catch (err) {
        if (isMounted) setUnavailable(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-sm text-gray-400">Wczytywanie kursow...</p>
      </div>
    );
  }

  if (unavailable || !current) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-clicolab-dark">Kursy walut (NBP)</h3>
      </div>
      <p className="text-xs text-gray-400 capitalize mb-4">{today}</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs text-gray-500">USD / PLN</p>
          <p className="text-xl font-bold text-clicolab-dark mt-1">
            {current.usd.rate.toFixed(4)}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-xs text-gray-500">EUR / PLN</p>
          <p className="text-xl font-bold text-clicolab-dark mt-1">
            {current.eur.rate.toFixed(4)}
          </p>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="usd" name="USD" stroke="#0F62FE" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="eur" name="EUR" stroke="#22C55E" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400 mt-2">Kurs sredni NBP, ostatnie 7 dni notowan.</p>
    </div>
  );
}
