import React, { useEffect, useState } from 'react';
import { Gift, CheckCircle, AlertCircle, Loader, Filter, Clock, Check } from 'lucide-react';
import { fetchAllClaims, confirmClaim } from '../services/api';

const AdminClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'PENDING', 'SUCCESS'
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadClaims = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllClaims();
      setClaims(data || []);
    } catch (err) {
      setError(err.message || 'Gagal mengambil data klaim reward');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleConfirm = async (id, userName, rewardName) => {
    setError('');
    setSuccess('');
    setActionLoadingId(id);
    try {
      await confirmClaim(id);
      setSuccess(`Klaim milik ${userName} (${rewardName}) berhasil dikonfirmasi!`);
      await loadClaims();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal mengonfirmasi klaim');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredClaims = claims.filter(claim => {
    if (filter === 'ALL') return true;
    return claim.status === filter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      {/* Notifications */}
      {success && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: 'var(--primary-color)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: '500' }}>{success}</span>
        </div>
      )}

      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary-color)' }}>
            <Gift size={28} />
            Konfirmasi Hadiah (Claims)
          </h1>
          <p className="page-subtitle">Verifikasi dan konfirmasi penukaran poin hadiah warga yang sedang diajukan.</p>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '16px 24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
            <Filter size={16} />
            Status Klaim:
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'PENDING', 'SUCCESS'].map((type) => {
              const isActive = filter === type;
              let label = 'Semua';
              if (type === 'PENDING') label = 'Menunggu Verifikasi (Pending)';
              if (type === 'SUCCESS') label = 'Telah Diserahkan (Success)';

              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'var(--transition)',
                    backgroundColor: isActive ? 'var(--primary-color)' : 'var(--bg-color)',
                    color: isActive ? 'white' : 'var(--text-main)',
                    boxShadow: isActive ? '0 4px 6px -1px rgba(5, 150, 105, 0.2)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-color)';
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Claims Table Container */}
      <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
        {error && (
          <div style={{
            margin: '24px',
            backgroundColor: '#fee2e2',
            color: 'var(--danger)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <Loader className="spin" size={32} color="var(--primary-color)" />
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Memuat daftar penukaran...</p>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Gift size={40} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Tidak ada penukaran reward ditemukan.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'rgba(5, 150, 105, 0.03)' }}>
                  <th style={{ padding: '18px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-muted)' }}>Warga / Pengguna</th>
                  <th style={{ padding: '18px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-muted)' }}>Barang Hadiah</th>
                  <th style={{ padding: '18px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-muted)' }}>Biaya Poin</th>
                  <th style={{ padding: '18px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-muted)' }}>Tanggal Pengajuan</th>
                  <th style={{ padding: '18px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '18px 24px', fontWeight: '600', fontSize: '14px', color: 'var(--text-muted)', textAlign: 'right' }}>Konfirmasi</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim, index) => {
                  const isPending = claim.status === 'PENDING';
                  return (
                    <tr 
                      key={claim.id} 
                      style={{ 
                        borderBottom: index !== filteredClaims.length - 1 ? '1px solid var(--border-color)' : 'none',
                        transition: 'var(--transition)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.01)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ fontWeight: '600', fontSize: '15px' }}>{claim.user?.nama || 'Pengguna Tidak Dikenal'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{claim.user?.email || '-'}</div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{claim.reward?.name || 'Hadiah Tidak Dikenal'}</div>
                      </td>
                      <td style={{ padding: '20px 24px', fontWeight: '700', color: 'var(--danger)', fontSize: '14px' }}>
                        - {claim.pointsSpent} Poin
                      </td>
                      <td style={{ padding: '20px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {formatDate(claim.claimDate)}
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          backgroundColor: isPending ? '#fef3c7' : '#d1fae5',
                          color: isPending ? '#d97706' : '#065f46'
                        }}>
                          {isPending ? <Clock size={12} /> : <Check size={12} />}
                          {isPending ? 'PENDING' : 'SUCCESS'}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        {isPending ? (
                          <button
                            onClick={() => handleConfirm(claim.id, claim.user?.nama, claim.reward?.name)}
                            disabled={actionLoadingId === claim.id}
                            style={{
                              backgroundColor: 'var(--primary-color)',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '13px',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'var(--transition)',
                              opacity: actionLoadingId === claim.id ? 0.7 : 1
                            }}
                            onMouseOver={(e) => {
                              if (actionLoadingId !== claim.id) e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                            }}
                            onMouseOut={(e) => {
                              if (actionLoadingId !== claim.id) e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                            }}
                          >
                            {actionLoadingId === claim.id ? <Loader className="spin" size={12} /> : <Check size={14} />}
                            Konfirmasi
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Telah Diserahkan</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminClaims;
