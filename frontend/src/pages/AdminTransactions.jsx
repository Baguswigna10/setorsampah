import React, { useState, useEffect } from 'react';
import { fetchAllTransactions } from '../services/api';
import { Search, Receipt, Leaf, Info } from 'lucide-react';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllTransactions();
      setTransactions(data || []);
    } catch (error) {
      console.error("Gagal memuat transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTransactions = transactions.filter(t =>
    (t.transactionId?.toString().includes(search.toLowerCase())) ||
    (t.items?.some(item => item.categoryName?.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="animate-fade-in">
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">Riwayat Transaksi</h1>
          <p className="page-subtitle">Pantau semua transaksi setoran sampah oleh pengguna.</p>
        </div>
      </header>

      <div className="glass-card" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari ID transaksi atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-color)',
              fontFamily: 'inherit',
              fontSize: '14px',
              outline: 'none',
              transition: 'var(--transition)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>
        <button
          onClick={loadData}
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: '600'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-color)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-card)';
            e.currentTarget.style.color = 'var(--text-main)';
          }}
        >
          Muat Ulang
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>ID Transaksi</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Tanggal</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>User ID</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Detail Setoran</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Total Berat</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Total Poin</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat data transaksi...</td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Receipt size={32} style={{ opacity: 0.5 }} />
                      <p>Tidak ada transaksi ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.transactionId} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }} className="table-row-hover">
                    <td style={{ padding: '16px 24px', fontWeight: '500' }}>#{tx.transactionId}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{formatDate(tx.transactionDate)}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                        User {tx.userId}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {tx.items?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                            <Leaf size={12} color="var(--primary-color)" />
                            <span>{item.categoryName} ({item.weight} Kg)</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: '500' }}>{tx.totalWeight} Kg</td>
                    <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--success)' }}>+{tx.totalPoint} Poin</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
