package com.example.setorsampah.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.setorsampah.dto.TransactionRequest;
import com.example.setorsampah.dto.TransactionRequestItem;
import com.example.setorsampah.dto.TransactionResponse;
import com.example.setorsampah.dto.TransactionResponseItem;
import com.example.setorsampah.model.BankCapacity;
import com.example.setorsampah.model.TransactionDetail;
import com.example.setorsampah.model.User;
import com.example.setorsampah.model.WasteBank;
import com.example.setorsampah.model.WasteCategory;
import com.example.setorsampah.model.WasteTransaction;
import com.example.setorsampah.repository.BankCapacityRepository;
import com.example.setorsampah.repository.UserRepository;
import com.example.setorsampah.repository.WasteBankRepository;
import com.example.setorsampah.repository.WasteCategoryRepository;
import com.example.setorsampah.repository.WasteTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final WasteTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WasteBankRepository bankRepository;
    private final WasteCategoryRepository categoryRepository;
    private final BankCapacityRepository capacityRepository;

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
        WasteBank bank = bankRepository.findById(request.getBankId())
                .orElseThrow(() -> new RuntimeException("Bank sampah tidak ditemukan"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Daftar item transaksi tidak boleh kosong");
        }

        WasteTransaction transaction = new WasteTransaction();
        transaction.setUser(user);
        transaction.setBank(bank);
        transaction.setTransactionDate(LocalDateTime.now());

        double totalWeight = 0.0;
        double totalPoint = 0.0;
        List<TransactionResponseItem> responseItems = new ArrayList<>();
        List<TransactionDetail> details = new ArrayList<>();

        for (TransactionRequestItem item : request.getItems()) {
            WasteCategory category = categoryRepository.findById(item.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Kategori sampah tidak ditemukan: " + item.getCategoryId()));

            if (item.getWeight() == null || item.getWeight() <= 0) {
                throw new RuntimeException("Berat sampah harus lebih besar dari nol");
            }

            BankCapacity capacity = capacityRepository.findByBankAndCategory(bank, category)
                    .orElseThrow(() -> new RuntimeException("Kapasitas kategori belum dikonfigurasi di bank sampah"));

            double available = capacity.getAvailableCapacity();
            if (available < item.getWeight()) {
                throw new RuntimeException("Kapasitas " + category.getName() + " di bank sampah tidak mencukupi. Tersisa " + available + " kg.");
            }

            double point = item.getWeight() * category.getPointPerKg();
            totalWeight += item.getWeight();
            totalPoint += point;

            capacity.setUsedCapacity(capacity.getUsedCapacity() + item.getWeight());
            capacityRepository.save(capacity);

            TransactionDetail detail = new TransactionDetail();
            detail.setTransaction(transaction);
            detail.setCategory(category);
            detail.setWeight(item.getWeight());
            detail.setPoint(point);
            details.add(detail);

            responseItems.add(new TransactionResponseItem(category.getId(), category.getName(), item.getWeight(), point));
        }

        transaction.setTotalWeight(totalWeight);
        transaction.setTotalPoint(totalPoint);
        transaction.setDetails(details);
        WasteTransaction saved = transactionRepository.save(transaction);

        user.setPoint(user.getPoint() + totalPoint);
        userRepository.save(user);

        return new TransactionResponse(saved.getId(), user.getId(), bank.getId(), totalWeight, totalPoint,
                saved.getTransactionDate(), responseItems);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions() {
        List<WasteTransaction> transactions = transactionRepository.findAll();
        List<TransactionResponse> responses = new ArrayList<>();
        for (WasteTransaction transaction : transactions) {
            responses.add(mapToResponse(transaction));
        }
        return responses;
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
        List<WasteTransaction> transactions = transactionRepository.findByUser(user);
        List<TransactionResponse> responses = new ArrayList<>();
        for (WasteTransaction transaction : transactions) {
            responses.add(mapToResponse(transaction));
        }
        return responses;
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByBankId(Long bankId) {
        WasteBank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new RuntimeException("Bank sampah tidak ditemukan"));
        List<WasteTransaction> transactions = transactionRepository.findByBank(bank);
        List<TransactionResponse> responses = new ArrayList<>();
        for (WasteTransaction transaction : transactions) {
            responses.add(mapToResponse(transaction));
        }
        return responses;
    }

    private TransactionResponse mapToResponse(WasteTransaction transaction) {
        List<TransactionResponseItem> responseItems = new ArrayList<>();
        for (TransactionDetail detail : transaction.getDetails()) {
            responseItems.add(new TransactionResponseItem(detail.getCategory().getId(), detail.getCategory().getName(), detail.getWeight(), detail.getPoint()));
        }
        return new TransactionResponse(transaction.getId(), transaction.getUser().getId(), transaction.getBank().getId(), transaction.getTotalWeight(), transaction.getTotalPoint(), transaction.getTransactionDate(), responseItems);
    }
}
