import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { History, Leaf, Gift, Loader, AlertCircle } from 'lucide-react';
import { fetchTransactionsByUserId, fetchClaimsByUserId } from '../services/api';

const UserHistory = () => {
  const { user } = useOutletContext();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      // Fetch both transactions (deposits) and claims (withdrawals)
      const [txs, claims] = await Promise.all([
        fetchTransactionsByUserId(user.id),
        fetchClaimsByUserId(user.id)
      ]);

      // Normalize transactions
      const normalizedTxs = (txs || []).map(tx => ({
        id: `tx-${tx.transactionId}`,
        type: 'DEPOSIT',
        date: tx.transactionDate,
        title: `Setor Sampah ${tx.items?.map(i => i.categoryName).join(', ') || ''}`,
        points: `+ ${tx.totalPoint.toLocaleString('id-ID')} Poin`,
        isPositive: true,
        extra: `${tx.totalWeight} Kg`,
        statusLabel: 'Selesai',
        statusType: 'success'
      }));

      // Normalize claims
      const normalizedClaims = (claims || []).map(claim => {
        const isPending = claim.status === 'PENDING';
        return {
          id: `claim-${claim.id}`,
          type: 'CLAIM',
          date: claim.claimDate,
          title: `Tukar ${claim.reward?.name || 'Hadiah'}`,
          points: `- ${claim.pointsSpent.toLocaleString('id-ID')} Poin`,
          isPositive: false,
          extra: claim.reward?.description || '',
          statusLabel: isPending ? 'Menunggu Konfirmasi' : 'Berhasil',
          statusType: isPending ? 'warning' : 'success'
        };
      });

      // Combine and sort chronologically (newest first)
      const combined = [...normalizedTxs, ...normalizedClaims].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      setHistoryItems(combined);
    } catch (err) {
      setError(err.message || 'Gagal memuat data riwayat Anda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

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
    <div className="animate-fade-in">
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary-color)' }}>
            <History size={28} />
            Riwayat Aktivitas Anda
          </h1>
          <p className="page-subtitle">Daftar semua penyetoran sampah dan penukaran hadiah yang pernah Anda lakukan.</p>
        </div>
      </header>

      <div className="glass-card">
        {error && (
          <div style={{
            marginBottom: '20px',
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
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Memuat riwayat Anda...</p>
          </div>
        ) : historyItems.length === 0 ? (
          <div style={{ height: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <History size={40} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Belum ada aktivitas tercatat.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {historyItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`delay-${index * 50} animate-fade-in`} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '20px 0', 
                  borderBottom: index !== historyItems.length - 1 ? '1px solid var(--border-color)' : 'none' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  {item.type === 'DEPOSIT' ? (
                    <div style={{ background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Leaf size={22} />
                    </div>
                  ) : (
                    <div style={{ background: '#fee2e2', color: 'var(--danger)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Gift size={22} />
                    </div>
                  )}
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{item.title}</h4>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>{formatDate(item.date)}</p>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: item.isPositive ? 'var(--success)' : 'var(--danger)' }}>
                    {item.points}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                    {item.extra && <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500' }}>{item.extra}</span>}
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      padding: '3px 10px', 
                      borderRadius: '12px',
                      background: item.statusType === 'success' ? '#d1fae5' : '#fef3c7',
                      color: item.statusType === 'success' ? '#065f46' : '#d97706'
                    }}>
                      {item.statusLabel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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

export default UserHistory;
