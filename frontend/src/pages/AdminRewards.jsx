import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Gift, Search, Plus, Edit2, Trash2, X, AlertCircle, CheckCircle, Loader, Upload, ImageIcon } from 'lucide-react';
import { fetchRewards, createReward, updateReward, deleteReward } from '../services/api';

const AdminRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedId, setSelectedId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [requiredPoints, setRequiredPoints] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Loading sub-state
  const [submitLoading, setSubmitLoading] = useState(false);

  const loadRewards = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRewards();
      setRewards(data || []);
    } catch (err) {
      setError(err.message || 'Gagal mengambil data reward');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  // Filter rewards locally if search is used, since fetchRewards might not support search yet
  const filteredRewards = rewards.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is handled locally
  };

  const openAddModal = () => {
    setModalMode('add');
    setName('');
    setRequiredPoints('');
    setStock('');
    setDescription('');
    setImageUrl('');
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (reward) => {
    setModalMode('edit');
    setName(reward.name);
    setRequiredPoints(reward.requiredPoints.toString());
    setStock(reward.stock.toString());
    setDescription(reward.description || '');
    setImageUrl(reward.imageUrl || '');
    setSelectedId(reward.id);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Hanya file gambar yang diperbolehkan');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) return setError('Nama reward tidak boleh kosong');
    if (!requiredPoints || parseFloat(requiredPoints) <= 0) return setError('Poin yang dibutuhkan harus lebih besar dari nol');
    if (!stock || parseInt(stock) < 0) return setError('Stok tidak boleh negatif');

    setSubmitLoading(true);
    try {
      const payload = {
        name: name.trim(),
        requiredPoints: parseFloat(requiredPoints),
        stock: parseInt(stock),
        description: description.trim(),
        imageUrl: imageUrl.trim()
      };

      if (modalMode === 'add') {
        await createReward(payload);
        setSuccess('Reward baru berhasil ditambahkan!');
      } else {
        await updateReward(selectedId, payload);
        setSuccess('Reward berhasil diperbarui!');
      }

      setIsModalOpen(false);
      loadRewards();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal memproses reward');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id, rewardName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus reward "${rewardName}"?`)) {
      setError('');
      setSuccess('');
      try {
        await deleteReward(id);
        setSuccess(`Reward "${rewardName}" berhasil dihapus!`);
        loadRewards();
        setTimeout(() => setSuccess(''), 4000);
      } catch (err) {
        setError(err.message || 'Gagal menghapus reward');
      }
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

      {/* Main Header */}
      <header style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '26px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
          <Gift size={26} style={{ color: 'var(--primary-color)' }} />
          Manajemen Reward
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Kelola data reward yang dapat ditukarkan oleh warga menggunakan poin.
        </p>
      </header>

      {/* Unified Toolbar Card (Search + Actions) */}
      <div className="glass-card" style={{ marginBottom: '20px', padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Side: Dynamic Search Form */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', maxWidth: '480px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Cari reward..."
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
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            />
          </div>
        </form>

        {/* Right Side: Primary Add Button */}
        <button
          onClick={openAddModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.15)',
            transition: 'var(--transition)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
        >
          <Plus size={18} />
          Tambah Reward
        </button>
      </div>

      {/* Main Table Container */}
      <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
        {error && (
          <div style={{
            margin: '18px 20px 0 20px',
            backgroundColor: '#fee2e2',
            color: 'var(--danger)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Loader className="spin" size={28} color="var(--primary-color)" />
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Memuat data reward...</p>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div style={{ height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Gift size={36} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tidak ada reward ditemukan.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'rgba(5, 150, 105, 0.02)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', width: '60px' }}>Gambar</th>
                  <th style={{ padding: '14px 20px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nama Reward</th>
                  <th style={{ padding: '14px 20px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Poin Dibutuhkan</th>
                  <th style={{ padding: '14px 20px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stok</th>
                  <th style={{ padding: '14px 20px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deskripsi</th>
                  <th style={{ padding: '14px 20px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRewards.map((reward, index) => (
                  <tr
                    key={reward.id}
                    style={{
                      borderBottom: index !== filteredRewards.length - 1 ? '1px solid var(--border-color)' : 'none',
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(5, 150, 105, 0.01)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: reward.imageUrl ? 'transparent' : 'rgba(5, 150, 105, 0.05)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {reward.imageUrl ? (
                          <img src={reward.imageUrl} alt={reward.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                        ) : null}
                        <Gift size={20} style={{ color: 'var(--primary-color)', opacity: 0.5, display: reward.imageUrl ? 'none' : 'block' }} />
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', fontSize: '14px' }}>{reward.name}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary-color)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {reward.requiredPoints} Poin
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '500' }}>
                      <span style={{ color: reward.stock > 0 ? 'var(--text-main)' : 'var(--danger)' }}>
                        {reward.stock} item
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {reward.description || '-'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          onClick={() => openEditModal(reward)}
                          title="Edit"
                          style={{
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--primary-color)',
                            backgroundColor: 'transparent',
                            transition: 'var(--transition)'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(reward.id, reward.name)}
                          title="Hapus"
                          style={{
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--danger)',
                            backgroundColor: 'transparent',
                            transition: 'var(--transition)'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Centered Modal Dialog */}
      {isModalOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="glass-card" style={{
            width: '90%',
            maxWidth: '460px',
            padding: '24px 28px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
            border: '1px solid var(--border-color)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--primary-color)' }}>
                {modalMode === 'add' ? 'Tambah Reward Baru' : 'Perbarui Reward'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ color: 'var(--text-muted)', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                    Nama Reward <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Voucher Belanja, Pulsa 50k"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  />
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                      Poin Dibutuhkan <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Contoh: 1000"
                      value={requiredPoints}
                      onChange={(e) => setRequiredPoints(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                      Stok <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 10"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      min="0"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                    Gambar Reward (Opsional)
                  </label>
                  <div
                    style={{
                      width: '100%',
                      height: '140px',
                      border: '2px dashed var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: 'transparent',
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    {imageUrl ? (
                      <>
                        <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f9fafb' }} />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImageUrl(''); }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '26px',
                            height: '26px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.9)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <Upload size={28} />
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>Klik untuk unggah gambar</span>
                        <span style={{ fontSize: '11px', opacity: 0.7 }}>(JPG, PNG, WEBP)</span>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                    Deskripsi Reward (Opsional)
                  </label>
                  <textarea
                    placeholder="Tuliskan deskripsi singkat mengenai reward..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'var(--transition)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'var(--transition)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
                >
                  {submitLoading && <Loader className="spin" size={12} />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* CSS Helper */}
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

export default AdminRewards;
