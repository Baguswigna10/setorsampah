package com.example.setorsampah.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.setorsampah.dto.TransactionRequest;
import com.example.setorsampah.dto.TransactionResponse;
import com.example.setorsampah.mapper.TransactionMapper;
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
public class TransactionServiceImpl implements TransactionService {

    private final WasteTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WasteBankRepository bankRepository;
    private final WasteCategoryRepository categoryRepository;
    private final BankCapacityRepository capacityRepository;

    @Override
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        if (request.getUserId() == null || request.getBankId() == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data transaksi tidak lengkap");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));
        WasteBank bank = bankRepository.findById(request.getBankId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bank sampah tidak ditemukan"));

        WasteTransaction transaction = new WasteTransaction();
        transaction.setUser(user);
        transaction.setBank(bank);
        transaction.setTransactionDate(LocalDateTime.now());

        double totalWeight = 0.0;
        double totalPoint = 0.0;

        for (var item : request.getItems()) {
            if (item.getCategoryId() == null || item.getWeight() == null || item.getWeight() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item transaksi tidak valid");
            }
            WasteCategory category = categoryRepository.findById(item.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kategori sampah tidak ditemukan"));
            BankCapacity capacity = capacityRepository.findByBankAndCategory(bank, category)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kapasitas kategori belum dikonfigurasi di bank sampah"));
            if (capacity.getAvailableCapacity() < item.getWeight()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kapasitas tidak mencukupi untuk kategori " + category.getName());
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
            transaction.getDetails().add(detail);
        }

        transaction.setTotalWeight(totalWeight);
        transaction.setTotalPoint(totalPoint);
        WasteTransaction saved = transactionRepository.save(transaction);

        user.setPoint(user.getPoint() + totalPoint);
        userRepository.save(user);

        return TransactionMapper.toResponse(saved);
    }

    @Override
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream().map(TransactionMapper::toResponse).toList();
    }

    @Override
    public TransactionResponse getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .map(TransactionMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaksi tidak ditemukan"));
    }

    @Override
    public List<TransactionResponse> getTransactionsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));
        return transactionRepository.findByUser(user).stream().map(TransactionMapper::toResponse).toList();
    }

    @Override
    public List<TransactionResponse> getTransactionsByBankId(Long bankId) {
        WasteBank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bank sampah tidak ditemukan"));
        return transactionRepository.findByBank(bank).stream().map(TransactionMapper::toResponse).toList();
    }
}
