package com.example.setorsampah.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.setorsampah.model.Admin;
import com.example.setorsampah.model.Reward;
import com.example.setorsampah.model.Warga;
import com.example.setorsampah.model.WasteBank;
import com.example.setorsampah.model.WasteCategory;
import com.example.setorsampah.model.WasteType;
import com.example.setorsampah.repository.RewardRepository;
import com.example.setorsampah.repository.UserRepository;
import com.example.setorsampah.repository.WasteBankRepository;
import com.example.setorsampah.repository.WasteCategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Order(1)
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WasteBankRepository wasteBankRepository;
    private final WasteCategoryRepository wasteCategoryRepository;
    private final RewardRepository rewardRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedWasteBanks();
        seedWasteCategories();
        seedRewards();
        log.info("========== DATA SEEDER SELESAI ==========");
    }

    // ==================== SEED USERS ====================
    private void seedUsers() {
        // Admin
        if (!userRepository.existsByEmail("admin@setorsampah.com")) {
            Admin admin = new Admin();
            admin.setNama("Administrator");
            admin.setEmail("admin@setorsampah.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setAlamat("Jl. Admin No. 1, Bandung");
            admin.setPoint(0.0);
            userRepository.save(admin);
            log.info("Seeder: Admin 'admin@setorsampah.com' berhasil dibuat.");
        }

        if (!userRepository.existsByEmail("admin2@setorsampah.com")) {
            Admin admin2 = new Admin();
            admin2.setNama("Admin Dua");
            admin2.setEmail("admin2@setorsampah.com");
            admin2.setPassword(passwordEncoder.encode("admin123"));
            admin2.setAlamat("Jl. Admin No. 2, Jakarta");
            admin2.setPoint(0.0);
            userRepository.save(admin2);
            log.info("Seeder: Admin 'admin2@setorsampah.com' berhasil dibuat.");
        }

        // Warga
        String[][] wargaData = {
            {"Budi Santoso",    "warga1@gmail.com", "warga123", "Jl. Merdeka No. 10, Bandung"},
            {"Siti Aminah",     "warga2@gmail.com", "warga123", "Jl. Asia Afrika No. 25, Bandung"},
            {"Ahmad Hidayat",   "warga3@gmail.com", "warga123", "Jl. Braga No. 5, Bandung"},
            {"Dewi Lestari",    "warga4@gmail.com", "warga123", "Jl. Dago No. 88, Bandung"},
            {"Rizky Pratama",   "warga5@gmail.com", "warga123", "Jl. Setiabudi No. 12, Bandung"},
        };

        for (String[] data : wargaData) {
            if (!userRepository.existsByEmail(data[1])) {
                Warga warga = new Warga();
                warga.setNama(data[0]);
                warga.setEmail(data[1]);
                warga.setPassword(passwordEncoder.encode(data[2]));
                warga.setAlamat(data[3]);
                warga.setPoint(0.0);
                userRepository.save(warga);
                log.info("Seeder: Warga '{}' berhasil dibuat.", data[1]);
            }
        }
    }

    // ==================== SEED WASTE BANKS ====================
    private void seedWasteBanks() {
        String[][] bankData = {
            {"Bank Sampah Berseri",      "Jl. Cihampelas No. 100, Bandung"},
            {"Bank Sampah Mawar",        "Jl. Buah Batu No. 45, Bandung"},
            {"Bank Sampah Melati",       "Jl. Pasteur No. 30, Bandung"},
            {"Bank Sampah Sejahtera",    "Jl. Soekarno Hatta No. 200, Bandung"},
            {"Bank Sampah Lestari",      "Jl. Gatot Subroto No. 15, Jakarta"},
        };

        for (String[] data : bankData) {
            if (!wasteBankRepository.existsByName(data[0])) {
                WasteBank bank = new WasteBank();
                bank.setName(data[0]);
                bank.setAddress(data[1]);
                wasteBankRepository.save(bank);
                log.info("Seeder: Bank Sampah '{}' berhasil dibuat.", data[0]);
            }
        }
    }

    // ==================== SEED WASTE CATEGORIES ====================
    private void seedWasteCategories() {
        Object[][] categoryData = {
            // {name, pointPerKg, description, wasteType}
            {"Plastik",     500.0,  "Sampah plastik seperti botol, kantong, dan kemasan plastik.",       WasteType.ANORGANIK},
            {"Kertas",      300.0,  "Sampah kertas seperti koran, majalah, kardus, dan buku bekas.",     WasteType.ANORGANIK},
            {"Logam",       800.0,  "Sampah logam seperti kaleng, besi tua, dan aluminium.",             WasteType.ANORGANIK},
            {"Kaca",        400.0,  "Sampah kaca seperti botol kaca, cermin pecah, dan gelas kaca.",     WasteType.ANORGANIK},
            {"Elektronik",  1500.0, "Sampah elektronik seperti HP rusak, charger, dan kabel.",           WasteType.B3},
            {"Baterai",     2000.0, "Baterai bekas dari berbagai perangkat elektronik.",                 WasteType.B3},
            {"Organik Dapur", 100.0, "Sisa makanan, kulit buah, dan sayuran busuk.",                     WasteType.ORGANIK},
            {"Organik Kebun", 150.0, "Daun kering, ranting pohon, dan rumput.",                          WasteType.ORGANIK},
            {"Kain/Tekstil",  350.0, "Pakaian bekas, kain perca, dan sepatu lama.",                      WasteType.ANORGANIK},
            {"Minyak Jelantah", 600.0, "Minyak goreng bekas yang sudah tidak layak pakai.",              WasteType.B3},
        };

        for (Object[] data : categoryData) {
            String name = (String) data[0];
            if (!wasteCategoryRepository.existsByName(name)) {
                WasteCategory category = new WasteCategory();
                category.setName(name);
                category.setPointPerKg((Double) data[1]);
                category.setDescription((String) data[2]);
                category.setWasteType((WasteType) data[3]);
                wasteCategoryRepository.save(category);
                log.info("Seeder: Kategori Sampah '{}' berhasil dibuat.", name);
            }
        }
    }

    // ==================== SEED REWARDS ====================
    private void seedRewards() {
        Object[][] rewardData = {
            // {name, description, pointCost, stock, imageUrl}
            {"Voucher Indomaret Rp25.000",  "Voucher belanja Indomaret senilai Rp25.000.",         2500.0,  50,  null},
            {"Voucher Alfamart Rp25.000",   "Voucher belanja Alfamart senilai Rp25.000.",          2500.0,  50,  null},
            {"Pulsa Rp10.000",              "Pulsa semua operator senilai Rp10.000.",               1000.0,  100, null},
            {"Pulsa Rp25.000",              "Pulsa semua operator senilai Rp25.000.",               2500.0,  80,  null},
            {"Pulsa Rp50.000",              "Pulsa semua operator senilai Rp50.000.",               5000.0,  40,  null},
            {"Tumbler Eco-Friendly",        "Tumbler stainless steel ramah lingkungan 500ml.",      3000.0,  30,  null},
            {"Tote Bag Recycle",            "Tas belanja dari bahan daur ulang.",                   1500.0,  60,  null},
            {"Bibit Tanaman",               "Bibit tanaman hias atau buah untuk ditanam di rumah.", 800.0,  100, null},
            {"Voucher GoPay Rp50.000",      "Saldo GoPay senilai Rp50.000.",                       5000.0,  25,  null},
            {"Kaos Setor Sampah",           "Kaos eksklusif bertema lingkungan dari Setor Sampah.", 4000.0,  20,  null},
        };

        for (Object[] data : rewardData) {
            String name = (String) data[0];
            // Cek apakah reward dengan nama ini sudah ada
            boolean exists = rewardRepository.findAll().stream()
                    .anyMatch(r -> r.getName().equals(name));
            if (!exists) {
                Reward reward = new Reward();
                reward.setName(name);
                reward.setDescription((String) data[1]);
                reward.setPointCost((Double) data[2]);
                reward.setStock((Integer) data[3]);
                reward.setImageUrl((String) data[4]);
                rewardRepository.save(reward);
                log.info("Seeder: Reward '{}' berhasil dibuat.", name);
            }
        }
    }
}
