import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchRewards, claimReward, fetchUserById } from '../services/api';

const Rewards = () => {
  const { user } = useOutletContext() || { user: null };
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [userPoints, setUserPoints] = useState(user?.point || 0);

  useEffect(() => {
    loadRewards();
    // Fetch fresh point balance from backend
    if (user?.id) {
      fetchUserById(user.id)
        .then(freshUser => {
          if (freshUser?.point != null) {
            setUserPoints(freshUser.point);
          }
        })
        .catch(err => console.error('Error fetching user points:', err));
    }
  }, [user]);

  const loadRewards = async () => {
    setLoading(true);
    try {
      const data = await fetchRewards();
      setRewards(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (reward) => {
    if (!user || !user.id) {
      setMessage({ type: 'error', text: 'Anda harus login untuk menukar reward.' });
      return;
    }

    if (userPoints < reward.pointCost) {
      setMessage({ type: 'error', text: `Poin Anda kurang untuk menukar reward ini. Butuh ${reward.pointCost.toLocaleString('id-ID')} poin.` });
      return;
    }

    if (reward.stock <= 0) {
      setMessage({ type: 'error', text: 'Maaf, stok hadiah ini sudah habis.' });
      return;
    }

    try {
      // Panggil API backend yang asli dengan userId asli
      await claimReward(reward.id, user.id);
      
      // Kurangi saldo poin dan stok di tampilan lokal untuk respons instan
      setUserPoints(prev => prev - reward.pointCost);
      setRewards(prev => prev.map(r => r.id === reward.id ? { ...r, stock: r.stock - 1 } : r));
      
      setMessage({ 
        type: 'success', 
        text: `Berhasil mengajukan klaim untuk "${reward.name}"! Penukaran Anda sedang menunggu konfirmasi admin.` 
      });
      
      // Sembunyikan notifikasi setelah 5 detik
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Gagal mengajukan penukaran poin.' });
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><p>Memuat katalog hadiah...</p></div>;
  }

  return (
    <div className="animate-fade-in">
      <header className="page-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h1 className="page-title">Katalog Reward</h1>
          <p className="page-subtitle">Tukarkan poin Anda dengan hadiah menarik.</p>
        </div>
        
        {/* User Balance Widget */}
        <div style={{ background: 'var(--primary-light)', padding: '12px 24px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Gift color="var(--primary-color)" />
          <div>
            <p style={{ fontSize: '12px', color: 'var(--primary-hover)', fontWeight: '600' }}>Saldo Poin Anda</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-hover)', lineHeight: '1' }}>{userPoints.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </header>

      {message && (
        <div style={{ 
          padding: '16px', 
          marginBottom: '24px', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${message.type === 'success' ? '#34d399' : '#f87171'}`
        }} className="animate-fade-in">
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontWeight: '500' }}>{message.text}</span>
        </div>
      )}

      <div className="stats-grid">
        {rewards.map((reward, index) => (
          <div key={reward.id} className={`glass-card delay-${(index + 1) * 100} animate-fade-in`} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              height: '140px', 
              background: reward.imageUrl ? 'transparent' : 'rgba(5, 150, 105, 0.05)', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              overflow: 'hidden'
            }}>
              {reward.imageUrl ? (
                <>
                  <img src={reward.imageUrl} alt={reward.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                  <Gift size={48} opacity={0.2} style={{ display: 'none' }} />
                </>
              ) : (
                <Gift size={48} opacity={0.2} />
              )}
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{reward.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', flex: 1, marginBottom: '16px' }}>{reward.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: '700', color: 'var(--primary-color)', fontSize: '20px' }}>{reward.pointCost} Poin</span>
              <span style={{ fontSize: '12px', color: reward.stock > 0 ? 'var(--text-muted)' : 'var(--danger)', fontWeight: '600' }}>
                {reward.stock > 0 ? `Sisa: ${reward.stock}` : 'Habis'}
              </span>
            </div>

            <button 
              onClick={() => handleClaim(reward)}
              disabled={reward.stock <= 0 || userPoints < reward.pointCost}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: (reward.stock <= 0 || userPoints < reward.pointCost) ? 'var(--border-color)' : 'var(--primary-color)',
                color: (reward.stock <= 0 || userPoints < reward.pointCost) ? 'var(--text-muted)' : 'white',
                fontWeight: '600',
                transition: 'var(--transition)',
                cursor: (reward.stock <= 0 || userPoints < reward.pointCost) ? 'not-allowed' : 'pointer'
              }}
              onMouseOver={(e) => {
                if(reward.stock > 0 && userPoints >= reward.pointCost) {
                  e.currentTarget.style.background = 'var(--primary-hover)';
                }
              }}
              onMouseOut={(e) => {
                if(reward.stock > 0 && userPoints >= reward.pointCost) {
                  e.currentTarget.style.background = 'var(--primary-color)';
                }
              }}
            >
              Tukar Poin
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
