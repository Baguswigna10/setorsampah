import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Award, Scale, Receipt, Gift, Leaf, History, TrendingUp, ArrowRight, Loader, Package } from 'lucide-react';
import { fetchTransactionsByUserId, fetchClaimsByUserId, fetchUserById } from '../services/api';

const UserDashboard = () => {
  const { user } = useOutletContext() || { user: null };
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [userPoints, setUserPoints] = useState(user?.point || 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        const [txs, claims, freshUser] = await Promise.all([
          fetchTransactionsByUserId(user.id),
          fetchClaimsByUserId(user.id),
          fetchUserById(user.id)
        ]);

        // Update point from fresh backend data
        if (freshUser?.point != null) {
          setUserPoints(freshUser.point);
        }

        const transactions = txs || [];
        const claimsList = claims || [];

        // Calculate stats from real data
        const totalTrashKg = transactions.reduce((sum, tx) => sum + (tx.totalWeight || 0), 0);
        const totalTransactions = transactions.length;
        const totalClaims = claimsList.length;
        const totalPointsEarned = transactions.reduce((sum, tx) => sum + (tx.totalPoint || 0), 0);

        setStats({
          totalTrashKg,
          totalTransactions,
          totalClaims,
          totalPointsEarned
        });

        // Build recent 5 transactions (deposits only, sorted newest first)
        const sortedTxs = [...transactions]
          .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
          .slice(0, 5);

        setRecentTransactions(sortedTxs);
      } catch (error) {
        console.error("Error fetching user dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch { return dateStr; }
  };

  const formatNumber = (num) => {
    if (num == null) return '0';
    return num.toLocaleString('id-ID');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '16px' }}>
        <Loader className="spin-anim" size={36} color="var(--primary-color)" />
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Memuat dashboard Anda...</p>
        <style>{`
          .spin-anim { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header Greeting */}
      <header className="page-header" style={{ marginBottom: '36px' }}>
        <div>
          <h1 className="page-title" style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Halo, {user?.nama || 'User'}! 👋
          </h1>
          <p className="page-subtitle">Selamat datang di SetorSampah. Berikut ringkasan aktivitas Anda.</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {/* Saldo Poin */}
        <div className="glass-card stat-card delay-100 animate-fade-in user-stat-card" style={{
          background: 'linear-gradient(135deg, #059669, #10b981)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.1)'
          }} />
          <div style={{
            position: 'absolute', bottom: '-30px', right: '20px', width: '70px', height: '70px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.07)'
          }} />
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'inline-flex', marginBottom: '14px' }}>
            <Award size={26} color="white" />
          </div>
          <span style={{ fontSize: '36px', fontWeight: '700', lineHeight: 1.2, letterSpacing: '-1px', display: 'block' }}>
            {formatNumber(userPoints)}
          </span>
          <span style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px', display: 'block' }}>Saldo Poin Anda</span>
        </div>

        {/* Total Sampah */}
        <div className="glass-card stat-card delay-200 animate-fade-in user-stat-card">
          <div className="stat-icon-wrapper icon-warning">
            <Scale size={24} />
          </div>
          <span className="stat-value">{formatNumber(stats?.totalTrashKg || 0)} Kg</span>
          <span className="stat-label">Total Sampah Disetor</span>
        </div>

        {/* Total Transaksi */}
        <div className="glass-card stat-card delay-300 animate-fade-in user-stat-card">
          <div className="stat-icon-wrapper icon-info">
            <Receipt size={24} />
          </div>
          <span className="stat-value">{formatNumber(stats?.totalTransactions || 0)}</span>
          <span className="stat-label">Total Transaksi</span>
        </div>

        {/* Total Klaim */}
        <div className="glass-card stat-card delay-300 animate-fade-in user-stat-card">
          <div className="stat-icon-wrapper icon-success">
            <Gift size={24} />
          </div>
          <span className="stat-value">{formatNumber(stats?.totalClaims || 0)}</span>
          <span className="stat-label">Total Klaim Reward</span>
        </div>
      </div>

      {/* Poin Earned Summary */}
      <div className="glass-card delay-300 animate-fade-in" style={{
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 28px',
        background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
        borderColor: '#bbf7d0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: '#dcfce7',
            color: '#16a34a',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Total Poin yang Pernah Diperoleh</p>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#15803d', letterSpacing: '-0.5px' }}>
              {formatNumber(stats?.totalPointsEarned || 0)} Poin
            </h3>
          </div>
        </div>
        <button
          onClick={() => navigate('/rewards')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'var(--transition)',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#059669'}
        >
          Tukar Poin
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Riwayat 5 Transaksi Terbaru */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={22} color="var(--primary-color)" />
          Riwayat Transaksi Terbaru
        </h2>
        <button
          onClick={() => navigate('/user/history')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--primary-color)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'var(--transition)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Lihat Semua
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="glass-card delay-300 animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
        {recentTransactions.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            gap: '12px'
          }}>
            <div style={{
              background: '#f3f4f6',
              padding: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={36} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>
              Belum ada transaksi tercatat.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
              Mulai setor sampah untuk mendapatkan poin!
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{
                  background: '#f9fafb',
                  borderBottom: '2px solid var(--border-color)'
                }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    No
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tanggal
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Kategori Sampah
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Berat (Kg)
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Poin
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, idx) => (
                  <tr
                    key={tx.transactionId}
                    className={`delay-${(idx + 1) * 100} animate-fade-in`}
                    style={{
                      borderBottom: idx !== recentTransactions.length - 1 ? '1px solid var(--border-color)' : 'none',
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: '500', color: 'var(--text-muted)' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary-color)',
                          padding: '8px',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Leaf size={16} />
                        </div>
                        <span style={{ fontWeight: '500' }}>{formatDate(tx.transactionDate)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {tx.items?.map((item, i) => (
                          <span key={i} style={{
                            background: '#f0f9ff',
                            color: '#0369a1',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: '1px solid #bae6fd'
                          }}>
                            {item.categoryName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: '600' }}>
                      {formatNumber(tx.totalWeight)} Kg
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: '700', color: 'var(--success)' }}>
                      + {formatNumber(tx.totalPoint)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        padding: '5px 14px',
                        borderRadius: '14px',
                        background: '#d1fae5',
                        color: '#065f46'
                      }}>
                        Selesai
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .user-stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .user-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.08);
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
