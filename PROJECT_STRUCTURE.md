# Struktur Proyek SetorSampah

## Deskripsi
Aplikasi backend Spring Boot untuk sistem digital bank sampah dengan arsitektur layered.

## Struktur Direktori

```
src/main/java/com/example/setorsampah/
├── SetorsampahApplication.java
├── config/
│   └── WebConfig.java
├── controller/
│   ├── DashboardController.java
│   ├── TransactionController.java
│   ├── UserController.java
│   ├── WasteBankController.java
│   └── WasteCategoryController.java
├── dto/
│   ├── ApiResponse.java
│   ├── BankCapacityRequest.java
│   ├── BankCapacityResponse.java
│   ├── DashboardResponse.java
│   ├── TransactionRequest.java
│   ├── TransactionRequestItem.java
│   ├── TransactionResponse.java
│   ├── TransactionResponseItem.java
│   ├── UserRequest.java
│   ├── UserResponse.java
│   ├── WasteBankRequest.java
│   ├── WasteBankResponse.java
│   ├── WasteCategoryRequest.java
│   └── WasteCategoryResponse.java
├── exception/
│   ├── ApiError.java
│   └── GlobalExceptionHandler.java
├── mapper/
│   ├── TransactionMapper.java
│   ├── UserMapper.java
│   ├── WasteBankMapper.java
│   └── WasteCategoryMapper.java
├── model/
│   ├── BankCapacity.java
│   ├── TransactionDetail.java
│   ├── User.java
│   ├── WasteBank.java
│   ├── WasteCategory.java
│   └── WasteTransaction.java
├── repository/
│   ├── BankCapacityRepository.java
│   ├── UserRepository.java
│   ├── WasteBankRepository.java
│   ├── WasteCategoryRepository.java
│   └── WasteTransactionRepository.java
└── service/
    ├── DashboardService.java
    ├── DashboardServiceImpl.java
    ├── TransactionService.java
    ├── TransactionServiceImpl.java
    ├── UserService.java
    ├── UserServiceImpl.java
    ├── WasteBankService.java
    ├── WasteBankServiceImpl.java
    ├── WasteCategoryService.java
    └── WasteCategoryServiceImpl.java
```

## Layered Architecture
- `controller/` menangani HTTP request dan response.
- `service/` menyimpan logika bisnis dan aturan transaksi.
- `repository/` berinteraksi dengan database melalui Spring Data JPA.
- `model/` berisi entitas JPA.
- `dto/` memisahkan objek request/response dari entitas.
- `mapper/` mengonversi entitas ke DTO dan sebaliknya.
- `exception/` menangani error global.
- `config/` menyiapkan konfigurasi JSON dan tanggal.

## Endpoint Utama
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `GET /api/categories`
- `POST /api/categories`
- `GET /api/categories/{id}`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`
- `GET /api/waste-banks`
- `POST /api/waste-banks`
- `GET /api/waste-banks/{id}`
- `PUT /api/waste-banks/{id}`
- `POST /api/waste-banks/{id}/capacities`
- `GET /api/waste-banks/{id}/capacities`
- `PUT /api/waste-banks/capacities/{capacityId}`
- `POST /api/transactions`
- `GET /api/transactions`
- `GET /api/transactions/{id}`
- `GET /api/transactions/users/{userId}`
- `GET /api/transactions/banks/{bankId}`
- `GET /api/dashboard/summary`

## Menjalankan Aplikasi
```bash
./mvnw spring-boot:run
```

## Database
Buat database MySQL `setorsampah`, kemudian jalankan aplikasi.
