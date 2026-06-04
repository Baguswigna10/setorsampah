import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Receipt, Scale, Award, Download } from 'lucide-react';
import { fetchDashboardSummary, fetchChartData } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useOutletContext() || { user: null };
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartFilter, setChartFilter] = useState('daily');

  useEffect(() => {
    const loadData = async () => {
      try {
        const summary = await fetchDashboardSummary();
        setData(summary);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      const loadChartData = async () => {
        try {
          const chart = await fetchChartData(chartFilter);
          setChartData(chart);
        } catch (error) {
          console.error("Error fetching chart data:", error);
        }
      };
      loadChartData();
    }
  }, [chartFilter, user]);

  const handleExportCSV = () => {
    if (!chartData || chartData.length === 0) return;

    const headers = ['Waktu', 'Total Berat (Kg)', 'Total Poin'];
    const csvContent = [
      headers.join(','),
      ...chartData.map(item => `"${item.label}",${item.weight},${item.points}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_sampah_${chartFilter}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-muted)' }}>Memuat data dashboard...</p>
      </div>
    );
  }

  // Admin Dashboard View
  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard Admin</h1>
          <p className="page-subtitle">Ringkasan aktivitas bank sampah Anda hari ini.</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="glass-card stat-card delay-100 animate-fade-in">
          <div className="stat-icon-wrapper icon-primary">
            <Users size={24} />
          </div>
          <span className="stat-value">{data?.totalUsers?.toLocaleString('id-ID') || 0}</span>
          <span className="stat-label">Total Pengguna Aktif</span>
        </div>

        <div className="glass-card stat-card delay-200 animate-fade-in">
          <div className="stat-icon-wrapper icon-info">
            <Receipt size={24} />
          </div>
          <span className="stat-value">{data?.totalTransactions?.toLocaleString('id-ID') || 0}</span>
          <span className="stat-label">Total Transaksi Selesai</span>
        </div>

        <div className="glass-card stat-card delay-300 animate-fade-in">
          <div className="stat-icon-wrapper icon-warning">
            <Scale size={24} />
          </div>
          <span className="stat-value">{data?.totalTrashKg?.toLocaleString('id-ID') || 0} Kg</span>
          <span className="stat-label">Total Sampah Terkumpul</span>
        </div>

        <div className="glass-card stat-card delay-300 animate-fade-in">
          <div className="stat-icon-wrapper icon-success">
            <Award size={24} />
          </div>
          <span className="stat-value">{data?.totalPoints?.toLocaleString('id-ID') || 0}</span>
          <span className="stat-label">Total Poin Didistribusikan</span>
        </div>
      </div>

      <div className="glass-card delay-300 animate-fade-in" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Statistik Setoran Sampah</h2>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={chartFilter}
              onChange={(e) => setChartFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                backgroundColor: 'var(--bg-color)',
                fontFamily: 'inherit',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="daily">7 Hari Terakhir</option>
              <option value="weekly">4 Minggu Terakhir</option>
              <option value="monthly">12 Bulan Terakhir</option>
              <option value="yearly">5 Tahun Terakhir</option>
            </select>

            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
            >
              <Download size={16} />
              Export Laporan (CSV)
            </button>
          </div>
        </div>

        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                cursor={{ fill: 'rgba(5, 150, 105, 0.05)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="weight" name="Berat (Kg)" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
