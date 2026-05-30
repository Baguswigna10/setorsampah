import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Receipt, Scale, Award, Leaf, History, Gift, Download } from 'lucide-react';
import { fetchDashboardSummary, fetchChartData, fetchTransactionsByUserId, fetchClaimsByUserId } from '../services/api';
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
        if (user?.role === 'ADMIN') {
          const summary = await fetchDashboardSummary();
          setData(summary);
        } else if (user?.role === 'USER' && user?.id) {
          // Build user-specific dashboard from real API data
          const [txs, claims] = await Promise.all([
            fetchTransactionsByUserId(user.id),
            fetchClaimsByUserId(user.id)
          ]);

          const totalTrashKg = (txs || []).reduce((sum, tx) => sum + (tx.totalWeight || 0), 0);

          const formatDate = (dateStr) => {
            if (!dateStr) return '-';
            try {
              return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            } catch { return dateStr; }
          };

          const depositActivities = (txs || []).map(tx => ({
            type: 'DEPOSIT',
            title: `Setor Sampah ${tx.items?.map(i => i.categoryName).join(', ') || ''}`,
            date: formatDate(tx.transactionDate),
            points: `+ ${tx.totalPoint?.toLocaleString('id-ID') || 0} Poin`,
            extra: `${tx.totalWeight || 0} Kg`,
            rawDate: tx.transactionDate
          }));

          const claimActivities = (claims || []).map(claim => ({
            type: 'CLAIM',
            title: `Tukar ${claim.reward?.name || 'Hadiah'}`,
            date: formatDate(claim.claimDate),
            points: `- ${claim.pointsSpent?.toLocaleString('id-ID') || 0} Poin`,
            extra: claim.status === 'PENDING' ? 'Menunggu Konfirmasi' : 'Berhasil',
            rawDate: claim.claimDate
          }));

          const recentActivities = [...depositActivities, ...claimActivities]
            .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))
            .slice(0, 5);

          setData({ totalTrashKg, recentActivities });
        }
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

  if (user?.role === 'USER') {
    return (
      <div className="animate-fade-in">
        <header className="page-header" style={{ marginBottom: '40px' }}>
          <div>
            <h1 className="page-title" style={{ color: 'var(--primary-color)' }}>Halo, {user.nama}! 👋</h1>
            <p className="page-subtitle">Selamat datang di SetorSampah. Mari mulai menabung sampah hari ini.</p>
          </div>
        </header>

        <div className="stats-grid">
          <div className="glass-card delay-100 animate-fade-in" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <Award size={32} color="white" />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Total Saldo Poin Anda</p>
            <h2 style={{ fontSize: '48px', margin: 0, fontWeight: '700', letterSpacing: '-1px' }}>{user.point?.toLocaleString('id-ID') || 0}</h2>
          </div>

          <div className="glass-card delay-200 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--primary-light)', padding: '16px', borderRadius: '50%', color: 'var(--primary-color)' }}>
              <Scale size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', margin: 0 }}>{data?.totalTrashKg?.toLocaleString('id-ID') || 0} Kg</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Total Sampah Disetor</p>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>Aktivitas Terakhir</h2>
        <div className="glass-card delay-300 animate-fade-in">
          {(!data?.recentActivities || data.recentActivities.length === 0) ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
              <History size={36} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Belum ada aktivitas tercatat.</p>
            </div>
          ) : (
            data.recentActivities.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: idx !== data.recentActivities.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: item.type === 'DEPOSIT' ? 'var(--primary-light)' : '#fee2e2', color: item.type === 'DEPOSIT' ? 'var(--primary-color)' : 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    {item.type === 'DEPOSIT' ? <Leaf size={20} /> : <Gift size={20} />}
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{item.title}</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>{item.date}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: '600', color: item.type === 'DEPOSIT' ? 'var(--success)' : 'var(--danger)' }}>{item.points}</p>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>{item.extra}</p>
                </div>
              </div>
            ))
          )}
        </div>
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
