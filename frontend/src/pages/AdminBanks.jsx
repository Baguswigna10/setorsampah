import React, { useEffect, useState } from 'react';
import { Trash2, Plus, AlertCircle, CheckCircle, Loader, User, Building, Scale, Tag, Gift } from 'lucide-react';
import { fetchUsers, fetchBanks, fetchCategories, createTransaction } from '../services/api';

const AdminBanks = () => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown data
  const [users, setUsers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);

  // Form state
  const [selectedUser, setSelectedUser] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [selectedBank, setSelectedBank] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [weight, setWeight] = useState('');

  const [calculatedPoints, setCalculatedPoints] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  // Recalculate points whenever weight or category changes
  useEffect(() => {
    if (selectedCategory && weight && !isNaN(weight)) {
      const category = categories.find(c => c.id.toString() === selectedCategory.toString());
      if (category) {
        setCalculatedPoints(category.pointPerKg * parseFloat(weight));
      } else {
        setCalculatedPoints(0);
      }
    } else {
      setCalculatedPoints(0);
    }
  }, [selectedCategory, weight, categories]);

  // Validasi Kategori & Kapasitas
  const selectedBankObj = banks.find(b => b.id.toString() === selectedBank.toString());
  const selectedCatObj = categories.find(c => c.id.toString() === selectedCategory.toString());

  let isCategorySupported = true;
  let capacityWarning = '';

  if (selectedBankObj && selectedCategory) {
    const cap = selectedBankObj.capacities?.find(c => c.categoryId.toString() === selectedCategory.toString());
    if (!cap) {
      isCategorySupported = false;
      capacityWarning = `Bank Sampah "${selectedBankObj.name}" tidak menerima kategori "${selectedCatObj?.name}".`;
    } else if (weight && parseFloat(weight) > cap.availableCapacity) {
      isCategorySupported = false;
      capacityWarning = `Kapasitas tersisa untuk "${selectedCatObj?.name}" di bank ini hanya ${cap.availableCapacity} kg.`;
    }
  }

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersData, banksData, categoriesData] = await Promise.all([
        fetchUsers(),
        fetchBanks(),
        fetchCategories()
      ]);
      setUsers(usersData || []);
      setBanks(banksData || []);
      setCategories(categoriesData.content || categoriesData || []);
    } catch (err) {
      setError(err.message || 'Gagal mengambil data referensi untuk form setoran.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedUser) return setError('Silakan pilih pengguna dengan mengklik dari daftar dropdown yang muncul (jangan hanya diketik).');
    if (!selectedBank) return setError('Pilih bank sampah tujuan.');
    if (!selectedCategory) return setError('Pilih kategori sampah.');
    if (!weight || parseFloat(weight) <= 0) return setError('Berat sampah harus lebih dari 0.');

    if (!isCategorySupported) {
      return setError(capacityWarning);
    }

    setSubmitLoading(true);
    try {
      const payload = {
        userId: parseInt(selectedUser),
        bankId: parseInt(selectedBank),
        items: [
          {
            categoryId: parseInt(selectedCategory),
            weight: parseFloat(weight)
          }
        ]
      };

      await createTransaction(payload);

      setSuccess('Setoran berhasil disimpan! Poin otomatis ditambahkan ke pengguna.');

      // Reset form
      setSelectedUser('');
      setUserSearch('');
      setSelectedCategory('');
      setWeight('');
      setCalculatedPoints(0);

      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan transaksi setoran.');
    } finally {
      setSubmitLoading(false);
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
          <Trash2 size={26} style={{ color: 'var(--primary-color)' }} />
          Input Setoran Sampah
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Catat transaksi setoran sampah warga ke Bank Sampah untuk konversi menjadi poin secara otomatis.
        </p>
      </header>

      {error && (
        <div style={{
          marginBottom: '20px',
          backgroundColor: '#fee2e2',
          color: 'var(--danger)',
          padding: '14px 20px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="glass-card" style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Loader className="spin" size={28} color="var(--primary-color)" />
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Memuat formulir...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

          {/* Form Card */}
          <div className="glass-card" style={{ padding: '24px 32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} color="var(--primary-color)" />
              Formulir Setoran
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* User Selection with Search */}
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                  <User size={16} color="var(--text-muted)" /> Cari Pengguna (Warga) <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ketik nama atau email..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setSelectedUser(''); // clear actual selection when typing
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  onBlur={() => {
                    // Delay hiding to allow click on dropdown item to register
                    setTimeout(() => setShowUserDropdown(false), 200);
                  }}
                  required={!selectedUser}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'var(--bg-color)',
                    fontFamily: 'inherit',
                    color: 'var(--text-main)'
                  }}
                  onFocusCapture={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                  onBlurCapture={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                />

                {/* Dropdown Options */}
                {showUserDropdown && userSearch && !selectedUser && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {users.filter(u => (u.nama || '').toLowerCase().includes(userSearch.toLowerCase()) || (u.email || '').toLowerCase().includes(userSearch.toLowerCase())).length > 0 ? (
                      users
                        .filter(u => (u.nama || '').toLowerCase().includes(userSearch.toLowerCase()) || (u.email || '').toLowerCase().includes(userSearch.toLowerCase()))
                        .map(user => (
                          <div
                            key={user.id}
                            onMouseDown={(e) => {
                              // Gunakan onMouseDown agar dieksekusi sebelum onBlur input menghilangkan dropdown
                              e.preventDefault();
                              setSelectedUser(user.id);
                              setUserSearch(`${user.nama} (${user.email})`);
                              setShowUserDropdown(false);
                            }}
                            style={{
                              padding: '10px 14px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f1f5f9',
                              fontSize: '14px',
                              color: 'var(--text-main)',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <span style={{ fontWeight: '600' }}>{user.nama}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</span>
                          </div>
                        ))
                    ) : (
                      <div style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>
                        Tidak ditemukan
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bank Selection */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                  <Building size={16} color="var(--text-muted)" /> Bank Sampah Tujuan <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'var(--bg-color)',
                    fontFamily: 'inherit',
                    color: selectedBank ? 'var(--text-main)' : 'var(--text-muted)'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <option value="" disabled>Pilih Bank Sampah</option>
                  {banks.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  ))}
                </select>
              </div>

              {/* Category & Weight Row */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '2', minWidth: '200px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                    <Tag size={16} color="var(--text-muted)" /> Kategori Sampah <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-color)',
                      fontFamily: 'inherit',
                      color: selectedCategory ? 'var(--text-main)' : 'var(--text-muted)'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <option value="" disabled>-- Pilih Kategori --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name} ({cat.pointPerKg} Poin/kg)</option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: '1', minWidth: '120px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                    <Scale size={16} color="var(--text-muted)" /> Berat (kg) <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    placeholder="Misal: 2.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
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

              {/* Tampilkan pesan validasi Bank vs Kategori */}
              {!isCategorySupported && capacityWarning && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  color: 'var(--danger)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  marginTop: '-4px'
                }}>
                  <AlertCircle size={16} />
                  <span>{capacityWarning}</span>
                </div>
              )}

              <div style={{ marginTop: '12px' }}>
                <button
                  type="submit"
                  disabled={submitLoading || !isCategorySupported}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '15px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)',
                    transition: 'var(--transition)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
                >
                  {submitLoading ? <Loader className="spin" size={18} /> : <CheckCircle size={18} />}
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>

          {/* Point Calculation Info Widget */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', minHeight: '200px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(5, 150, 105, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
              }}>
                <Gift size={32} color="var(--primary-color)" />
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Estimasi Poin Didapat</p>
              <h2 style={{ fontSize: '42px', fontWeight: '800', color: 'var(--primary-hover)', lineHeight: '1', marginBottom: '8px' }}>
                {calculatedPoints > 0 ? calculatedPoints.toLocaleString('id-ID') : '0'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', opacity: 0.8 }}>Poin akan otomatis ditambahkan ke saldo pengguna setelah disimpan.</p>
            </div>
          </div>

        </div>
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
      `}</style>
    </div>
  );
};

export default AdminBanks;
