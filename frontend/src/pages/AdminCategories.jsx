import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tag, Search, Plus, Edit2, Trash2, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
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
  const [pointPerKg, setPointPerKg] = useState('');
  const [description, setDescription] = useState('');

  // Loading sub-state
  const [submitLoading, setSubmitLoading] = useState(false);

  const loadCategories = async (searchQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCategories(searchQuery);
      setCategories(data.content || []);
    } catch (err) {
      setError(err.message || 'Gagal mengambil data kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCategories(search);
  };

  const openAddModal = () => {
    setModalMode('add');
    setName('');
    setPointPerKg('');
    setDescription('');
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setModalMode('edit');
    setName(cat.name);
    setPointPerKg(cat.pointPerKg.toString());
    setDescription(cat.description || '');
    setSelectedId(cat.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) return setError('Nama kategori tidak boleh kosong');
    if (!pointPerKg || parseFloat(pointPerKg) <= 0) return setError('Poin per kg harus berupa angka lebih besar dari nol');

    setSubmitLoading(true);
    try {
      const payload = {
        name: name.trim(),
        pointPerKg: parseFloat(pointPerKg),
        description: description.trim()
      };

      if (modalMode === 'add') {
        await createCategory(payload);
        setSuccess('Kategori baru berhasil ditambahkan!');
      } else {
        await updateCategory(selectedId, payload);
        setSuccess('Kategori berhasil diperbarui!');
      }

      setIsModalOpen(false);
      loadCategories(search);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal memproses kategori');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${catName}"?`)) {
      setError('');
      setSuccess('');
      try {
        await deleteCategory(id);
        setSuccess(`Kategori "${catName}" berhasil dihapus!`);
        loadCategories(search);
        setTimeout(() => setSuccess(''), 4000);
      } catch (err) {
        setError(err.message || 'Gagal menghapus kategori');
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
          <Tag size={26} style={{ color: 'var(--primary-color)' }} />
          Kategori Sampah
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Manajemen data jenis sampah yang dapat disetorkan beserta poin imbalan per kilogram.
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
              placeholder="Cari kategori sampah..."
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
          <button
            type="submit"
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
            Cari
          </button>
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
          Tambah Kategori
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
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Memuat kategori sampah...</p>
          </div>
        ) : categories.length === 0 ? (
          <div style={{ height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Tag size={36} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tidak ada kategori sampah ditemukan.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'rgba(5, 150, 105, 0.02)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nama Kategori</th>
                  <th style={{ padding: '14px 20px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Poin per Kg</th>
                  <th style={{ padding: '14px 20px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deskripsi</th>
                  <th style={{ padding: '14px 20px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr
                    key={cat.id}
                    style={{
                      borderBottom: index !== categories.length - 1 ? '1px solid var(--border-color)' : 'none',
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(5, 150, 105, 0.01)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: '600', fontSize: '14px' }}>{cat.name}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary-color)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {cat.pointPerKg} Poin
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.description || '-'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          onClick={() => openEditModal(cat)}
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
                          onClick={() => handleDelete(cat.id, cat.name)}
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
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--primary-color)' }}>
                {modalMode === 'add' ? 'Tambah Kategori Baru' : 'Perbarui Kategori'}
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
                    Nama Kategori <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Plastik, Logam, Kertas"
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

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                    Poin per Kilogram <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Contoh: 5.0"
                    value={pointPerKg}
                    onChange={(e) => setPointPerKg(e.target.value)}
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

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                    Deskripsi Kategori (Opsional)
                  </label>
                  <textarea
                    placeholder="Tuliskan deskripsi singkat mengenai kategori..."
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

export default AdminCategories;
