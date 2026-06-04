# LAPORAN PENGEMBANGAN SISTEM INFORMASI SETORSAMPAH

---

## **BAB 1: PENDAHULUAN**

### **1.1 Latar Belakang**

Pengelolaan sampah merupakan salah satu tantangan utama dalam kehidupan masyarakat modern, khususnya di Indonesia. Setiap hari, volume sampah yang dihasilkan terus meningkat seiring dengan bertambahnya populasi dan konsumsi masyarakat. Sampah yang tidak dikelola dengan baik dapat menyebabkan berbagai masalah lingkungan seperti pencemaran tanah, air, dan udara, serta berpotensi menimbulkan penyakit.

Untuk mengatasi permasalahan tersebut, konsep **Bank Sampah** telah berkembang sebagai solusi inovatif yang mengajak masyarakat untuk berpartisipasi aktif dalam pengelolaan sampah. Bank Sampah adalah sebuah gerakan sosial yang mengumpulkan sampah yang masih memiliki nilai ekonomis untuk didaur ulang atau diproses lebih lanjut. Selain manfaat lingkungan, sistem Bank Sampah juga memberikan insentif ekonomis kepada masyarakat melalui akumulasi poin yang dapat ditukarkan dengan hadiah atau uang tunai.

Namun, sistem Bank Sampah konvensional masih mengalami beberapa keterbatasan:
- **Pencatatan Manual**: Proses pencatatan transaksi dilakukan secara manual, sehingga rentan terhadap kesalahan data
- **Transparansi Terbatas**: Masyarakat sulit memantau akumulasi poin dan riwayat setoran mereka secara real-time
- **Efisiensi Operasional**: Pengelolaan data sampah dan reward memerlukan waktu dan sumber daya yang cukup besar
- **Laporan Terbatas**: Sulit untuk menghasilkan laporan komprehensif mengenai jumlah sampah yang telah dikumpulkan

Dengan kemajuan teknologi digital, sistem manajemen Bank Sampah dapat ditingkatkan melalui aplikasi berbasis teknologi informasi. **SetorSampah** adalah platform digital yang dirancang untuk mengatasi keterbatasan-keterbatasan tersebut dengan menyediakan solusi manajemen Bank Sampah yang terintegrasi, efisien, dan mudah digunakan.

---

### **1.2 Rumusan Masalah**

Berdasarkan latar belakang di atas, rumusan masalah dalam pengembangan sistem ini adalah:

1. **Bagaimana merancang dan mengimplementasikan sistem informasi manajemen Bank Sampah yang memungkinkan pencatatan transaksi secara digital dan real-time?**
   - Subsistem: Pencatatan setoran sampah dengan kategori dan berat yang akurat

2. **Bagaimana mengimplementasikan sistem akumulasi dan pengelolaan poin yang transparan untuk pengguna?**
   - Subsistem: Perhitungan poin otomatis berdasarkan berat dan jenis sampah
   - Subsistem: Tracking poin dan riwayat transaksi pengguna

3. **Bagaimana merancang dan membangun fitur reward/hadiah sehingga pengguna dapat menukar poin mereka dengan hadiah yang menarik?**
   - Subsistem: Katalog reward yang dapat dikelola oleh admin
   - Subsistem: Sistem claim/penukaran reward

4. **Bagaimana mengintegrasikan berbagai komponen sistem (user management, transaction, inventory) dalam satu platform yang kohesif?**
   - Subsistem: Manajemen pengguna dengan role-based access control
   - Subsistem: Manajemen bank sampah dan kapasitas penyimpanan
   - Subsistem: Manajemen kategori sampah

5. **Bagaimana mengimplementasikan sistem keamanan berbasis token (JWT) untuk melindungi data pengguna dan transaksi?**
   - Subsistem: Autentikasi dan otorisasi pengguna
   - Subsistem: Enkripsi password dan token management

6. **Bagaimana menghasilkan laporan dan statistik komprehensif mengenai total sampah, distribusi per kategori, dan tren setoran sampah?**
   - Subsistem: Sistem pelaporan terstruktur dengan breakdown per kategori

---

### **1.3 Tujuan**

Tujuan pengembangan sistem SetorSampah adalah:

1. **Tujuan Umum**
   - Membangun platform digital terintegrasi untuk manajemen Bank Sampah yang mampu meningkatkan efisiensi operasional dan transparansi dalam pengelolaan sampah

2. **Tujuan Khusus**
   - Mengembangkan sistem pencatatan transaksi setoran sampah secara digital dengan akurasi tinggi
   - Mengimplementasikan mekanisme perhitungan dan akumulasi poin otomatis berdasarkan berat dan kategori sampah
   - Membangun fitur pengelolaan reward dan sistem penukaran poin yang mudah digunakan
   - Mengintegrasikan manajemen pengguna dengan sistem role-based access control (RBAC) untuk membedakan fungsi admin dan warga
   - Mengimplementasikan sistem keamanan berbasis JWT untuk autentikasi dan otorisasi yang aman
   - Mengembangkan fitur pelaporan dan analitik yang dapat menghasilkan insights mengenai total sampah, distribusi per kategori, dan trend setoran
   - Membangun dashboard interaktif untuk pengguna dan admin dengan visualisasi data yang informatif
   - Menerapkan prinsip-prinsip Object-Oriented Programming (OOP) termasuk inheritance, polymorphism, dan abstraction dalam desain sistem

---

### **1.4 Manfaat**

Pengembangan sistem SetorSampah diharapkan memberikan manfaat sebagai berikut:

#### **1.4.1 Manfaat Bagi Masyarakat/Warga**
- **Transparansi**: Dapat memantau saldo poin dan riwayat transaksi setoran sampah secara real-time melalui dashboard personal
- **Kemudahan Akses**: Interface yang user-friendly memudahkan warga untuk mencatat setoran sampah kapan saja dan dari mana saja
- **Insentif Jelas**: Sistem reward yang transparan mendorong partisipasi aktif dalam pengelolaan sampah
- **Motivasi Lingkungan**: Dengan visual progress poin dan hadiah yang menarik, warga termotivasi untuk terus berkontribusi dalam pengurangan sampah

#### **1.4.2 Manfaat Bagi Pengelola Bank Sampah (Admin)**
- **Efisiensi Operasional**: Otomasi pencatatan dan perhitungan poin mengurangi beban kerja manual dan kesalahan administrasi
- **Data Akurat**: Sistem digital menghasilkan data yang lebih akurat dan dapat diaudit
- **Laporan Komprehensif**: Dapat menghasilkan laporan terstruktur mengenai total sampah, distribusi per kategori, dan performa bank sampah
- **Manajemen Inventory**: Dapat memantau kapasitas penyimpanan sampah di setiap bank sampah
- **Manajemen Reward**: Mudah mengelola katalog reward dan tracking penukaran hadiah

#### **1.4.3 Manfaat Bagi Lingkungan**
- **Peningkatan Partisipasi**: Sistem yang menarik dan transparan mendorong lebih banyak masyarakat untuk berpartisipasi dalam pengelolaan sampah
- **Pengurangan Sampah ke TPA**: Dengan meningkatnya partisipasi, volume sampah yang dapat didaur ulang meningkat, sehingga mengurangi beban tempat pembuangan akhir (TPA)
- **Kesadaran Lingkungan**: Program ini meningkatkan kesadaran masyarakat akan pentingnya pengelolaan sampah dan daur ulang

#### **1.4.4 Manfaat Bagi Pengembang/Institusi Pendidikan**
- **Pembelajaran Praktis**: Proyek ini memberikan kesempatan untuk menerapkan konsep-konsep OOP, desain architecture, dan best practices dalam software engineering
- **Portfolio Profesional**: Sistem yang dikembangkan dapat menjadi portfolio berharga untuk menunjukkan kemampuan full-stack development
- **Kontribusi Sosial**: Produk yang dihasilkan dapat memberikan dampak positif nyata kepada komunitas

---

## **BAB 2: LANDASAN TEORI**

### **Daftar Topik/Sub-Bab yang Perlu Dibahas:**

#### **2.1 Pengelolaan Sampah dan Bank Sampah**
- 2.1.1 Definisi dan Konsep Sampah
- 2.1.2 Klasifikasi dan Kategori Sampah (organic, anorganik, berbahaya)
- 2.1.3 Pengertian Bank Sampah
- 2.1.4 Mekanisme Operasional Bank Sampah Konvensional
- 2.1.5 Manfaat dan Tantangan Bank Sampah

#### **2.2 Sistem Informasi dan Teknologi Digital**
- 2.2.1 Definisi Sistem Informasi
- 2.2.2 Komponen-Komponen Sistem Informasi (hardware, software, data, people, process)
- 2.2.3 Sistem Informasi untuk Manajemen Operasional
- 2.2.4 Teknologi Cloud dan API Web Services
- 2.2.5 Database dan Data Management

#### **2.3 Arsitektur Perangkat Lunak (Software Architecture)**
- 2.3.1 Pola Arsitektur: Layered Architecture (Presentation, Business, Data Layer)
- 2.3.2 REST API dan RESTful Web Services
- 2.3.3 Client-Server Architecture
- 2.3.4 Frontend dan Backend Integration
- 2.3.5 Separation of Concerns dalam Software Design

#### **2.4 Object-Oriented Programming (OOP)**
- 2.4.1 Paradigma Object-Oriented
- 2.4.2 Konsep Inheritance (Pewarisan)
  - Single Table Inheritance (STI) dalam JPA
  - Abstract Class dan Concrete Implementation
- 2.4.3 Polymorphism (Polimorfisme)
  - Method Overriding
  - Interface Implementation
- 2.4.4 Encapsulation dan Access Modifiers
- 2.4.5 Abstraction dan Design Pattern

#### **2.5 Framework dan Teknologi Backend**
- 2.5.1 Spring Framework dan Spring Boot
- 2.5.2 Spring Data JPA dan ORM (Object-Relational Mapping)
- 2.5.3 Dependency Injection dan Inversion of Control (IoC)
- 2.5.4 Spring Security dan Authentication
- 2.5.5 Exception Handling dan Global Exception Handler

#### **2.6 Keamanan Aplikasi Web**
- 2.6.1 Autentikasi dan Otorisasi
- 2.6.2 JSON Web Token (JWT)
  - Struktur dan Komponen JWT
  - Proses Signing dan Verification
  - Claim dan Expiration
- 2.6.3 Password Hashing dan Encoding
- 2.6.4 Role-Based Access Control (RBAC)
- 2.6.5 CORS (Cross-Origin Resource Sharing)

#### **2.7 Database dan Data Management**
- 2.7.1 Relational Database dan SQL
- 2.7.2 MySQL Database Architecture
- 2.7.3 Entity-Relationship Model (ER Model)
- 2.7.4 Normalisasi Database
- 2.7.5 Query dan Indexing untuk Optimasi Performa

#### **2.8 Frontend Development**
- 2.8.1 React dan Component-Based Architecture
- 2.8.2 State Management dan Hooks
- 2.8.3 Routing dan Navigation
- 2.8.4 API Integration dari Frontend
- 2.8.5 UI/UX Design Principles

#### **2.9 Pola dan Prinsip Desain (Design Patterns & Principles)**
- 2.9.1 MVC (Model-View-Controller) Pattern
- 2.9.2 DTO (Data Transfer Object) Pattern
- 2.9.3 Repository Pattern dan Data Access Layer
- 2.9.4 Service Layer Pattern
- 2.9.5 Mapper Pattern untuk Konversi Object
- 2.9.6 SOLID Principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)

#### **2.10 Sistem Reward dan Gamification**
- 2.10.1 Konsep Gamification dalam User Engagement
- 2.10.2 Sistem Poin dan Akumulasi
- 2.10.3 Desain Reward Catalog
- 2.10.4 Mekanisme Redemption dan Claim
- 2.10.5 Behavioral Economics dalam Incentive Design

#### **2.11 Testing dan Quality Assurance**
- 2.11.1 Unit Testing dengan JUnit 5
- 2.11.2 Integration Testing
- 2.11.3 API Testing dan Tools (Postman)
- 2.11.4 Test-Driven Development (TDD)
- 2.11.5 Code Coverage dan Quality Metrics

#### **2.12 Build Tool dan DevOps**
- 2.12.1 Maven dan Dependency Management
- 2.12.2 Build Process dan Maven Lifecycle
- 2.12.3 Project Configuration Management
- 2.12.4 Continuous Integration (CI) Basics

---

### **Catatan Tambahan untuk Bab 2:**

Setiap topik dapat diperdalami dengan:
- **Konsep Teoritis**: Penjelasan mendalam tentang konsep dan prinsip
- **Implementasi dalam Proyek**: Contoh konkret bagaimana topik diterapkan dalam sistem SetorSampah
- **Diagram dan Ilustrasi**: Entity Relationship Diagram (ERD), Class Diagram, Sequence Diagram, Architecture Diagram
- **Kode Snippets**: Potongan kode yang relevan dari proyek untuk ilustrasi konsep
- **Best Practices**: Best practices industri yang diterapkan dalam pengembangan sistem

---

**Total Topik Landasan Teori: 12 Bab Utama dengan 53+ Sub-Topik**

---

## **BAB 3: STUDI KASUS - SISTEM SETORSAMPAH**

### **3.1 Deskripsi Sistem**

#### **3.1.1 Gambaran Umum Sistem**

**SetorSampah** adalah platform digital berbasis web dan REST API yang dirancang untuk mengotomatisasi dan mengoptimalkan operasional Bank Sampah modern. Sistem ini menghubungkan tiga kelompok pengguna utama:

1. **Warga (User)**: Individu yang ingin menyetor sampah dan mengumpulkan poin
2. **Pengelola Bank Sampah (Admin)**: Staf yang mengelola operasional bank sampah
3. **Administrator Sistem**: Tim teknis yang mengelola keseluruhan platform

Sistem ini menyediakan solusi end-to-end untuk:
- Pendaftaran dan autentikasi pengguna dengan keamanan tingkat enterprise
- Pencatatan transaksi setoran sampah secara real-time
- Perhitungan otomatis akumulasi poin berdasarkan berat dan kategori sampah
- Pengelolaan katalog reward dan sistem penukaran hadiah
- Pelaporan dan analitik komprehensif tentang performa Bank Sampah
- Dashboard interaktif untuk monitoring dan decision making

#### **3.1.2 Arsitektur Sistem**

**SetorSampah** menggunakan arsitektur **Layered Architecture** dengan pisah jelas antara lapisan-lapisan:

```
┌─────────────────────────────────────────────────────────┐
│           PRESENTATION LAYER (Frontend)                 │
│  React.js Dashboard | User Interface | Reporting UI     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│           API GATEWAY LAYER (Backend)                   │
│  Controllers | Request/Response Handling | Routing      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           BUSINESS LOGIC LAYER (Services)               │
│  TransactionService | UserService | RewardService      │
│  DashboardService | ReportService | RewardClaimService │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           SECURITY LAYER                                 │
│  JWT Authentication | Role-Based Access Control (RBAC)  │
│  Password Hashing | Token Validation                     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           DATA ACCESS LAYER (Repository)                │
│  UserRepository | TransactionRepository                 │
│  WasteCategoryRepository | WasteBankRepository           │
│  RewardRepository | RewardClaimRepository                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           DATABASE LAYER                                 │
│  MySQL Database | Transaction Management                │
│  Data Persistence | Query Optimization                  │
└─────────────────────────────────────────────────────────┘
```

**Teknologi Stack:**
- **Backend**: Java 17, Spring Boot 4.0.6, Spring Data JPA, Spring Security
- **Frontend**: React.js, Vite, Recharts untuk visualisasi
- **Database**: MySQL 8.x
- **Authentication**: JWT (JSON Web Token)
- **Build Tool**: Maven
- **Additional Libraries**: Lombok, Jakarta Validation, JUnit 5

#### **3.1.3 Entitas Utama dan Relationship**

**Entity-Relationship Model:**

```
┌──────────────────┐
│     User*        │  (Abstract Base Class)
├──────────────────┤
│ - id (PK)        │
│ - nama           │      ┌─────────────┐
│ - alamat         │      │   Warga     │  (Inheritance: Child)
│ - email (Unique) │◄─────┤  - role=    │
│ - password       │      │    "WARGA"  │
│ - point          │      └─────────────┘
└──┬───────────────┘
   │                      ┌─────────────┐
   └──────────────────────┤   Admin     │  (Inheritance: Child)
                          │ - role=     │
                          │   "ADMIN"   │
                          └─────────────┘

┌──────────────────────┐         1:N        ┌─────────────────┐
│   WasteTransaction   │◄─────────────────┐ │     User        │
├──────────────────────┤                   │ └─────────────────┘
│ - id (PK)            │
│ - totalWeight        │
│ - totalPoint         │      N:1          ┌──────────────────┐
│ - transactionDate    │──────────────────►│   WasteBank      │
└──┬──────────────────┘                    ├──────────────────┤
   │ 1:N                                   │ - id (PK)        │
   │                    ┌──────────────────┤ - nama           │
   └───────────────────►│ TransactionDetail│ - alamat         │
                        ├──────────────────┤ - capacity       │
                        │ - id (PK)        │ - currentWeight  │
                        │ - weight         │ - location       │
                        │ - category (FK)  │ └──────────────────┘
                        │ - transaction(FK)│
                        └──┬───────────────┘
                           │ N:1
                           ▼
                    ┌──────────────────┐
                    │  WasteCategory   │
                    ├──────────────────┤
                    │ - id (PK)        │
                    │ - name           │
                    │ - description    │
                    └──────────────────┘

┌────────────────┐       N:1        ┌──────────────┐
│  RewardClaim   │──────────────────►│    Reward    │
├────────────────┤                   ├──────────────┤
│ - id (PK)      │                   │ - id (PK)    │
│ - user (FK)    │   N:1             │ - name       │
│ - reward (FK)  │─────────────────┐ │ - pointCost  │
│ - pointsSpent  │                 │ │ - stock      │
│ - status       │                 │ │ - imageUrl   │
│ - claimDate    │ ┌───────────────┘ └──────────────┘
└────────────────┘ │
                   └─ User
```

#### **3.1.4 Use Case Diagram**

```
                            ┌─────────────────────────┐
                            │      SetorSampah        │
                            │      Platform           │
                            └─────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
              ┌─────▼────┐      ┌─────▼────┐     ┌─────▼────┐
              │  Warga    │      │  Admin   │     │ System   │
              └─────┬────┘      └─────┬────┘     └─────┬────┘
                    │                 │               │
        ┌───────────┼────────────────┼───────────────┼────────┐
        │           │                │               │        │
   ┌────▼────┐ ┌───▼───┐  ┌────────▼────────┐  ┌───▼──┐ ┌──▼─────┐
   │Register │ │ Login │  │Manage Users     │  │View  │ │Monitor │
   └─────────┘ └───┬───┘  └────────────────┘  │Stats │ │ System │
                   │                          └──────┘ └────────┘
        ┌──────────┼──────────────────────┬─────────────────────┐
        │          │                      │                     │
   ┌────▼────┐ ┌──▼──────┐  ┌───────────▼───────────┐ ┌────────▼────┐
   │View Poin│ │Setor    │  │Manage Waste Bank      │ │Manage       │
   │History  │ │Sampah   │  │- Add/Edit/Delete Bank │ │Reward       │
   └─────────┘ └────┬────┘  └───────────────────────┘ └────────────┘
                    │
        ┌───────────┼──────────┐
        │           │          │
   ┌────▼────┐ ┌───▼──────┐ ┌─▼──────────┐
   │Lihat    │ │Generate  │ │Manage Bank │
   │Reward   │ │Report    │ │Capacity    │
   └─────────┘ └──────────┘ └────────────┘
        │
   ┌────▼────┐
   │ Tukar    │
   │ Reward   │
   └──────────┘
```

#### **3.1.5 Alur Proses Utama**

**Proses Setoran Sampah:**
```
Warga Login
    ↓
Pilih Bank Sampah
    ↓
Input Kategori & Berat Sampah
    ↓
Sistem Hitung Poin (Berat × Rate per Kategori)
    ↓
Simpan Transaksi ke Database
    ↓
Update Akumulasi Poin User
    ↓
Update Kapasitas Bank Sampah
    ↓
Konfirmasi Setoran & Tampilkan Poin Baru
```

**Proses Penukaran Reward:**
```
Warga Lihat Reward Catalog
    ↓
Pilih Reward (Jika Poin Cukup)
    ↓
Sistem Buat Claim Request
    ↓
Admin Verifikasi Claim
    ↓
Update Status Claim (Approved/Rejected)
    ↓
Jika Approved:
  - Kurangi Poin User
  - Kurangi Stock Reward
  - Update Claim Status
    ↓
Notifikasi ke Warga
```

---

### **3.2 Kebutuhan Fungsional**

Kebutuhan fungsional didefinisikan berdasarkan fitur dan fungsionalitas sistem yang harus diimplementasikan.

#### **3.2.1 Modul Autentikasi & Manajemen User**

**FR-AUTH-01: Register User**
- User dapat mendaftar dengan email, password, nama, dan alamat
- Sistem validasi format email dan kekuatan password
- Password di-hash sebelum disimpan ke database
- Registrasi user baru mendapatkan role "WARGA" secara default
- Response: Token JWT untuk login otomatis atau pesan sukses registrasi
- Error handling untuk email yang sudah terdaftar

**FR-AUTH-02: Login User**
- User dapat login dengan email dan password
- Sistem validasi email dan password terhadap database
- Jika berhasil, sistem menginstruksi token JWT dengan informasi user
- Token memiliki expiration time 24 jam
- Response: JWT token dengan user role (ADMIN/WARGA) dan basic user info
- Error handling untuk email tidak ditemukan atau password salah

**FR-AUTH-03: JWT Token Validation**
- Sistem memvalidasi JWT token pada setiap request ke endpoint yang protektif
- Token invalid atau expired akan mengembalikan HTTP 401 Unauthorized
- User harus re-login jika token sudah expired

**FR-AUTH-04: Role-Based Access Control (RBAC)**
- Endpoint yang berbeda accessible sesuai role pengguna
- Admin dapat akses semua endpoint admin
- Warga hanya bisa akses endpoint user dan data miliknya sendiri
- Request tanpa token atau dengan role tidak sesuai → HTTP 403 Forbidden

**FR-USER-05: View User Profile**
- User dapat melihat profil pribadi mereka (nama, email, alamat, saldo poin)
- Admin dapat melihat daftar semua user
- Admin dapat melihat detail user spesifik

**FR-USER-06: Update User Profile**
- User dapat mengupdate nama, alamat, password mereka
- Admin dapat mengupdate data user manapun
- Password lama harus diverifikasi sebelum change password
- Notifikasi perubahan data

**FR-USER-07: Delete User Account**
- User dapat menghapus akun mereka sendiri
- Admin dapat menghapus akun user manapun
- Soft delete: data tetap ada di database tapi flag inactive

#### **3.2.2 Modul Manajemen Waste Category (Kategori Sampah)**

**FR-CAT-01: Create Waste Category**
- Admin dapat membuat kategori sampah baru
- Input: nama kategori, deskripsi, point conversion rate (poin per kg)
- Validasi nama kategori tidak boleh duplikat
- Response: Category ID dan data kategori yang dibuat

**FR-CAT-02: View Waste Categories**
- User dapat melihat daftar semua kategori sampah (untuk panduan)
- Admin dapat melihat daftar kategori dengan detail dan point rate
- Endpoint publik untuk kategori listing

**FR-CAT-03: View Category Detail**
- User/Admin dapat melihat detail kategori tertentu (ID, nama, deskripsi, point rate)

**FR-CAT-04: Update Waste Category**
- Admin dapat mengupdate nama, deskripsi, dan point conversion rate kategori
- Jika point rate berubah, hanya berlaku untuk transaksi baru ke depannya
- Validasi tidak boleh duplicate nama

**FR-CAT-05: Delete Waste Category**
- Admin dapat menghapus kategori sampah
- Soft delete untuk menjaga integritas data historis
- Kategori tidak bisa dihapus jika masih ada transaksi yang mereferensi

#### **3.2.3 Modul Manajemen Waste Bank (Bank Sampah)**

**FR-BANK-01: Create Waste Bank**
- Admin dapat membuat bank sampah baru
- Input: nama bank, lokasi, kapasitas maksimal penyimpanan
- Response: Bank ID dan data bank yang dibuat

**FR-BANK-02: View Waste Banks**
- User dapat melihat daftar bank sampah (untuk memilih lokasi setoran)
- Admin dapat melihat daftar lengkap dengan status kapasitas
- Include informasi lokasi dan kapasitas tersisa

**FR-BANK-03: View Bank Detail**
- User/Admin dapat melihat detail bank sampah tertentu
- Include: nama, lokasi, kapasitas maksimal, current weight, kapasitas tersisa

**FR-BANK-04: Update Waste Bank**
- Admin dapat mengupdate nama, lokasi, kapasitas maksimal bank

**FR-BANK-05: Delete Waste Bank**
- Admin dapat menghapus data bank sampah
- Soft delete jika sudah ada transaksi

**FR-BANK-06: Manage Bank Capacity**
- Sistem otomatis update current weight bank saat ada transaksi setoran
- Admin dapat melihat historical capacity trends
- Alert jika kapasitas bank sudah mencapai threshold tertentu (misal 80%)

#### **3.2.4 Modul Manajemen Transaksi Setoran Sampah**

**FR-TRX-01: Create Transaction (Setor Sampah)**
- User dapat membuat transaksi setoran sampah
- Input: bank ID, array dari kategori sampah + berat untuk setiap kategori
- Sistem hitung total berat dan total poin berdasarkan:
  - Berat × Point conversion rate masing-masing kategori
  - Akumulasi total dari semua kategori dalam satu transaksi
- Validasi: User poin (tidak harus dikurangi di step ini), bank kapasitas cukup
- Response: Transaction ID, detail transaksi, total poin yang didapat
- Automatic update User poin balance dan Bank current weight

**FR-TRX-02: View Transaction History**
- User dapat melihat history transaksi miliknya sendiri
- Include: tanggal, bank, berat per kategori, total berat, poin yang didapat
- Sorting: terbaru ke terlama
- Pagination support

**FR-TRX-03: View Transaction Detail**
- User dapat melihat detail transaksi specific (transaction ID)
- Include: breakdown kategori sampah, berat per kategori, poin calculation

**FR-TRX-04: View All Transactions (Admin)**
- Admin dapat melihat semua transaksi dari seluruh user dan bank
- Filter: by user, by bank, by date range, by category
- Include informasi user yang melakukan transaksi

**FR-TRX-05: View Transactions by Bank**
- Admin/System dapat melihat semua transaksi di bank tertentu
- Useful untuk bank-specific reporting

#### **3.2.5 Modul Pengelolaan Reward & Poin**

**FR-REW-01: Create Reward**
- Admin dapat membuat reward baru
- Input: nama reward, deskripsi, point cost (poin yang diperlukan), stock
- Upload image/icon untuk reward
- Response: Reward ID dan data reward

**FR-REW-02: View Reward Catalog**
- User dapat melihat daftar reward yang tersedia
- Display: nama, deskripsi, poin yang dibutuhkan, stock status (available/habis)
- Highlight reward yang bisa user klaim (berdasarkan poin mereka)
- Filter: by point range, by stock availability

**FR-REW-03: View Reward Detail**
- User dapat melihat detail reward tertentu
- Include: nama, deskripsi, point cost, stock, image

**FR-REW-04: Update Reward**
- Admin dapat mengupdate nama, deskripsi, poin cost, stock, image reward
- Dapat update status active/inactive reward

**FR-REW-05: Delete Reward**
- Admin dapat menghapus reward
- Soft delete jika sudah ada history claim

**FR-REW-06: Claim/Redeem Reward**
- User dapat claim reward jika poin mereka cukup
- Input: reward ID
- Sistem check: user poin ≥ reward point cost AND stock > 0
- Jika valid: create RewardClaim record dengan status PENDING
- Response: Claim ID dan message "Menunggu konfirmasi admin"
- Automatic update poin user (kurang), stock reward (kurang)

**FR-REW-07: Admin Approve/Reject Claim**
- Admin dapat view daftar pending reward claims
- Admin dapat approve claim → status = APPROVED
- Admin dapat reject claim → status = REJECTED dan refund poin ke user
- Include comment/reason untuk reject

**FR-REW-08: View Claim History**
- User dapat melihat history reward yang sudah di-claim (approved/rejected)
- Include: tanggal claim, reward, poin yang dihabiskan, status
- Admin dapat view semua claim history dari semua user

#### **3.2.6 Modul Dashboard & Reporting**

**FR-DASH-01: User Dashboard**
- User dashboard display:
  - Total poin saldo saat ini
  - Total berat sampah yang sudah disetor (all-time)
  - Transaksi terbaru (top 5)
  - Reward claim history (approved activities)
  - Progress bars/charts untuk visualisasi

**FR-DASH-02: Admin Dashboard**
- Admin dashboard display:
  - Total transaksi today/this week/this month
  - Total sampah collected (all-time dan per period)
  - Top waste categories by volume
  - Top users by poin/contribution
  - Bank sampah status (current capacity)
  - Pending reward claims count
  - Charts & graphs untuk trend analysis

**FR-REP-01: Total Waste Report**
- Endpoint: GET /api/reports/total-waste
- Return report dengan:
  - Total jumlah transaksi
  - Total berat sampah (kg) seluruh transaksi
  - Total poin yang telah diakumulasikan
  - Breakdown berat per kategori sampah
  - Data dapat di-export ke CSV

**FR-REP-02: Report by Date Range**
- Laporan sampah dalam range tanggal tertentu
- Input: start date, end date
- Breakdown per kategori dan trend per hari

**FR-REP-03: Report by Waste Bank**
- Laporan sampah per bank tertentu
- Include: total berat, breakdown kategori, transaksi count
- Performance metrics untuk setiap bank

**FR-REP-04: Report by User**
- Admin dapat generate laporan kontribusi user tertentu
- Include: total berat, total poin, reward claims, trend

#### **3.2.7 Modul Support OOP & Inheritance**

**FR-OOP-01: User Inheritance (Abstract Base Class)**
- Base class `User` dengan field umum (id, nama, email, password, point)
- Subclass `Admin` dan `Warga` extend User
- Implementasi polymorphism pada method `getRole()`
- Gunakan Single Table Inheritance di database (field `role` discriminator)

**FR-OOP-02: Interface PointCalculatable**
- Interface `PointCalculatable` dengan method untuk kalkulasi poin
- Implementasi di entity yang berhubungan dengan poin
- Support untuk extension ke fitur gamification di masa depan

---

### **3.3 Kebutuhan Non-Fungsional**

Kebutuhan non-fungsional mendefinisikan kualitas, performa, dan karakteristik sistem secara keseluruhan.

#### **3.3.1 Performance & Scalability**

**NFR-PERF-01: Response Time**
- Sebagian besar endpoint harus respond dalam ≤ 500ms
- Endpoint report/analytics dengan data besar boleh ≤ 2000ms
- Database query harus dioptimasi dengan indexing

**NFR-PERF-02: Throughput**
- Sistem harus handle minimal 100 concurrent users
- Load test untuk memastikan tidak ada bottleneck pada transaction creation

**NFR-PERF-03: Data Volume Scalability**
- Database schema harus scalable untuk jutaan transaksi
- Proper indexing pada frequently queried fields (user_id, bank_id, transaction_date)
- Partitioning strategy untuk tabel transaksi yang besar

**NFR-PERF-04: Memory Management**
- Aplikasi harus efficient dalam memory usage (heap size ≤ 512MB untuk production)
- Pagination untuk result sets yang besar
- Lazy loading untuk relationships

#### **3.3.2 Security**

**NFR-SEC-01: Authentication**
- JWT token-based authentication untuk semua protected endpoints
- Token expiration: 24 jam (configurable)
- Refresh token mechanism untuk extend session tanpa re-login

**NFR-SEC-02: Authorization**
- Role-Based Access Control (RBAC) dengan dua role: ADMIN dan WARGA
- Setiap endpoint harus jelas mendefinisikan role yang diizinkan
- Access violation harus log dan notify

**NFR-SEC-03: Data Protection**
- Password harus di-hash menggunakan bcrypt atau argon2
- Sensitive data (password, credit card info jika ada) tidak boleh log
- Database connection harus menggunakan SSL/TLS

**NFR-SEC-04: Input Validation**
- Semua input dari user harus divalidasi (type, length, format, range)
- Prevent SQL injection dengan parameterized queries
- Prevent XSS dengan input sanitization

**NFR-SEC-05: CORS Security**
- CORS policy dikonfigurasi untuk allow hanya dari frontend domain yang authorized
- Prevent cross-site request forgery (CSRF) attacks

**NFR-SEC-06: Encryption**
- Komunikasi server-client menggunakan HTTPS/TLS
- Sensitive configuration di-store dalam environment variables
- Database credentials tidak di-hardcode

#### **3.3.3 Reliability & Availability**

**NFR-REL-01: Uptime**
- Target uptime: 99.5% (monthly downtime ≤ 3.6 jam)
- Graceful degradation jika dependency (database) down

**NFR-REL-02: Error Handling**
- Semua exceptions harus di-handle dengan proper error messages
- Global exception handler untuk konsistensi error responses
- Meaningful error codes dan messages untuk debugging

**NFR-REL-03: Data Backup**
- Database backup otomatis setiap hari
- Backup retention policy: keep 30 days of backups
- Test restore procedure secara berkala

**NFR-REL-04: Logging & Monitoring**
- Comprehensive logging untuk semua transaction dan error events
- Log level configuration (DEBUG, INFO, WARN, ERROR)
- Monitoring alerts untuk critical issues
- Access logs untuk audit trail

**NFR-REL-05: Database Transaction Integrity**
- ACID compliance untuk semua database transactions
- Proper transaction boundaries untuk prevent data inconsistency
- Rollback mechanism untuk failed operations

#### **3.3.4 Usability & User Experience**

**NFR-UX-01: User Interface Responsiveness**
- Frontend UI harus responsive dan user-friendly
- Support mobile, tablet, dan desktop screen sizes
- Loading indicators untuk long-running operations
- Form validation feedback yang jelas

**NFR-UX-02: Documentation**
- API documentation lengkap (swagger/OpenAPI spec)
- User guide dan admin guide
- Code documentation dan comments untuk maintainability

**NFR-UX-03: Accessibility**
- Mengikuti WCAG 2.1 accessibility guidelines
- Support keyboard navigation
- Proper color contrast for readability

**NFR-UX-04: Multi-language Support**
- UI dapat dikonfigurasi untuk bahasa Indonesia dan English
- Error messages localized

#### **3.3.5 Maintainability & Code Quality**

**NFR-MAINT-01: Code Standards**
- Consistent code style dan naming conventions
- Follow SOLID principles dalam design
- Maximum cyclomatic complexity: 10 per method

**NFR-MAINT-02: Test Coverage**
- Unit test coverage minimum 70% untuk business logic
- Integration test untuk critical workflows
- Automated test execution dalam CI/CD pipeline

**NFR-MAINT-03: Version Control**
- Git untuk source code management
- Meaningful commit messages
- Branch strategy (feature branches, release branches)
- Code review sebelum merge ke main

**NFR-MAINT-04: Documentation**
- Architecture documentation (ADR - Architecture Decision Records)
- API documentation (OpenAPI/Swagger)
- Database schema documentation (ERD)
- Deployment runbook

#### **3.3.6 Compatibility & Standards**

**NFR-COMP-01: Browser Compatibility**
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Progressive enhancement untuk older browsers

**NFR-COMP-02: Java/Framework Version**
- Java 17+ compatibility
- Spring Boot 4.0.6+
- MySQL 8.0+

**NFR-COMP-03: REST API Standards**
- Mengikuti REST conventions
- Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Consistent JSON response format dengan envelope (status, data, message)

**NFR-COMP-04: Data Format Standards**
- ISO 8601 untuk date/time format
- UTF-8 encoding untuk semua text
- Proper number formatting untuk currency/weight

#### **3.3.7 Compliance & Legal**

**NFR-COMP-05: Privacy & Data Protection**
- Implementasi data privacy sesuai peraturan (jika ada - misalnya GDPR-like regulation)
- User dapat request export data pribadi mereka
- User dapat request delete data pribadi (right to be forgotten)

**NFR-COMP-06: Audit Trail**
- Semua action penting di-log dengan user, timestamp, action detail
- Immutable audit log untuk compliance purposes

**NFR-COMP-07: SLA (Service Level Agreement)**
- Response time target: 99% requests ≤ 500ms
- Availability target: 99.5% uptime
- Support response time: 24 jam untuk critical issues

---

