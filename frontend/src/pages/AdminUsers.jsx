import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Users, MapPin, Mail, Award, Shield, UserPlus, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { fetchUsers, registerUser } from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create user state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama: '', email: '', password: '', alamat: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Gagal memuat pengguna:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = users.filter(u =>
    (u.nama?.toLowerCase().includes(search.toLowerCase())) ||
    (u.email?.toLowerCase().includes(search.toLowerCase())) ||
    (u.alamat?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.nama || !formData.email || !formData.password || !formData.alamat) {
      return setFormError('Semua kolom harus diisi.');
    }

    setFormLoading(true);
    try {
      await registerUser(formData.nama, formData.email, formData.password, formData.alamat);
      setFormSuccess(`Pengguna ${formData.nama} berhasil didaftarkan!`);
      setFormData({ nama: '', email: '', password: '', alamat: '' });
      loadData(); // Refresh list

      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess('');
      }, 2000);
    } catch (err) {
      setFormError(err.message || 'Gagal mendaftarkan pengguna baru.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">Manajemen Pengguna</h1>
          <p className="page-subtitle">Kelola daftar seluruh pengguna yang terdaftar pada sistem SetorSampah.</p>
        </div>
      </header>

      <div className="glass-card" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari nama, email, atau alamat..."
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '12px 20px',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'var(--transition)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
          >
            <UserPlus size={18} />
            Daftarkan Warga
          </button>
          <button
            onClick={loadData}
            style={{
              padding: '12px 20px',
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
      </div>

      {/* Modal Tambah Pengguna */}
      {showModal && createPortal(
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="glass-card" style={{
            width: '90%',
            maxWidth: '500px',
            padding: '32px',
            position: 'relative',
            animation: 'slideUp 0.3s ease-out',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>Daftarkan Warga Baru</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Bantu warga lanjut usia untuk membuat akun agar bisa menyetor sampah.</p>

            {formSuccess && (
              <div style={{ backgroundColor: '#dcfce7', color: 'var(--success)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <CheckCircle size={18} /> {formSuccess}
              </div>
            )}

            {formError && (
              <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <AlertCircle size={18} /> {formError}
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Nama Lengkap <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Misal: Budi Santoso"
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Email <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Misal: budi@warga.com (bisa dibuatkan email simpel)"
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Alamat Lengkap <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Misal: Jl. Mawar Blok A2"
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Buat Kata Sandi Sementara <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Misal: warga123"
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontFamily: 'inherit' }}
                />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Warga dapat masuk menggunakan email dan kata sandi ini nantinya.</p>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                style={{
                  marginTop: '8px', padding: '14px', backgroundColor: 'var(--primary-color)', color: 'white',
                  border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}
              >
                {formLoading ? <Loader className="spin" size={18} /> : <UserPlus size={18} />}
                Daftarkan Sekarang
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>User ID</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Nama Pengguna</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Informasi Kontak</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Total Saldo Poin</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat data pengguna...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Users size={32} style={{ opacity: 0.5 }} />
                      <p>Tidak ada pengguna ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }} className="table-row-hover">
                    <td style={{ padding: '16px 24px', fontWeight: '500' }}>#{u.id}</td>
                    <td style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-main)' }}>{u.nama}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                          <Mail size={14} />
                          <span>{u.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                          <MapPin size={14} />
                          <span>{u.alamat}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        background: u.role === 'ADMIN' ? '#fee2e2' : 'var(--primary-light)',
                        color: u.role === 'ADMIN' ? 'var(--danger)' : 'var(--primary-color)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {u.role === 'ADMIN' ? <Shield size={12} /> : <Users size={12} />}
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: 'var(--success)' }}>
                        <Award size={16} />
                        <span>{u.point?.toLocaleString('id-ID') || 0} Poin</span>
                      </div>
                    </td>
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

export default AdminUsers;
