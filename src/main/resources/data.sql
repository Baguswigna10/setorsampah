INSERT IGNORE INTO users (nama, alamat, role, point, email, password) VALUES
('Admin', 'Jl. Merdeka 1', 'ADMIN', 0.0, 'admin@setorsampah.id', 'admin123'),
('Budi', 'Jl. Melati 7', 'USER', 0.0, 'budi@example.com', 'password');

INSERT IGNORE INTO waste_categories (name, point_per_kg, description, waste_type) VALUES
('Plastik', 5.0, 'Sampah plastik jenis botol dan kantong', 'ANORGANIK'),
('Kertas', 3.0, 'Kertas bekas, koran, majalah', 'ORGANIK'),
('Logam', 8.0, 'Logam ringan seperti kaleng dan tutup botol', 'ANORGANIK'),
('Baterai', 15.0, 'Baterai bekas dan limbah B3', 'B3');

INSERT IGNORE INTO waste_banks (name, address) VALUES
('Bank Sampah Hijau', 'Jl. Sejahtera No. 10'),
('Bank Sampah Berseri', 'Jl. Kebersihan No. 22');

INSERT IGNORE INTO bank_capacities (bank_id, category_id, max_capacity, used_capacity) VALUES
(1, 1, 100.0, 0.0),
(1, 2, 150.0, 0.0),
(2, 1, 200.0, 0.0),
(2, 3, 120.0, 0.0);

INSERT IGNORE INTO rewards (name, point_cost, stock) VALUES
('Tas Belanja Ramah Lingkungan', 100.0, 20),
('Voucher Sembako 50rb', 500.0, 10);
