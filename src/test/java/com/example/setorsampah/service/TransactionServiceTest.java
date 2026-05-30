package com.example.setorsampah.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.example.setorsampah.dto.TransactionRequest;
import com.example.setorsampah.dto.TransactionRequestItem;
import com.example.setorsampah.dto.TransactionResponse;
import com.example.setorsampah.model.BankCapacity;
import com.example.setorsampah.model.Warga;
import com.example.setorsampah.model.WasteBank;
import com.example.setorsampah.model.WasteCategory;
import com.example.setorsampah.model.WasteTransaction;
import com.example.setorsampah.repository.BankCapacityRepository;
import com.example.setorsampah.repository.UserRepository;
import com.example.setorsampah.repository.WasteBankRepository;
import com.example.setorsampah.repository.WasteCategoryRepository;
import com.example.setorsampah.repository.WasteTransactionRepository;
import com.example.setorsampah.security.SecurityUtils;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private WasteTransactionRepository transactionRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private WasteBankRepository bankRepository;
    @Mock
    private WasteCategoryRepository categoryRepository;
    @Mock
    private BankCapacityRepository capacityRepository;
    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    @Test
    void createTransaction_appliesWargaBonus() {
        Warga warga = new Warga();
        warga.setId(2L);
        warga.setPoint(0.0);

        WasteBank bank = new WasteBank();
        bank.setId(1L);

        WasteCategory category = new WasteCategory();
        category.setId(1L);
        category.setName("Plastik");
        category.setPointPerKg(5.0);

        BankCapacity capacity = new BankCapacity();
        capacity.setMaxCapacity(100.0);
        capacity.setUsedCapacity(0.0);

        TransactionRequest request = new TransactionRequest(2L, 1L, List.of(new TransactionRequestItem(1L, 10.0)));

        when(userRepository.findById(2L)).thenReturn(Optional.of(warga));
        when(bankRepository.findById(1L)).thenReturn(Optional.of(bank));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(capacityRepository.findByBankAndCategory(bank, category)).thenReturn(Optional.of(capacity));
        when(transactionRepository.save(any(WasteTransaction.class))).thenAnswer(invocation -> {
            WasteTransaction tx = invocation.getArgument(0);
            tx.setId(1L);
            return tx;
        });
        when(securityUtils.getCurrentUserId()).thenReturn(2L);

        TransactionResponse response = transactionService.createTransaction(request);

        assertEquals(55.0, response.getTotalPoint());
        assertEquals(55.0, warga.getPoint());
        verify(userRepository).save(warga);
    }

    @Test
    void deleteTransaction_rollsBackUserPoints() {
        Warga warga = new Warga();
        warga.setId(2L);
        warga.setPoint(55.0);

        WasteTransaction transaction = new WasteTransaction();
        transaction.setId(1L);
        transaction.setUser(warga);
        transaction.setTotalPoint(55.0);
        transaction.setDetails(List.of());

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

        transactionService.deleteTransaction(1L);

        assertEquals(0.0, warga.getPoint());
        verify(transactionRepository).delete(transaction);
    }

    @Test
    void createTransaction_rejectsAdminUser() {
        com.example.setorsampah.model.Admin admin = new com.example.setorsampah.model.Admin();
        admin.setId(1L);

        TransactionRequest request = new TransactionRequest(1L, 1L, List.of(new TransactionRequestItem(1L, 5.0)));
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));

        assertThrows(ResponseStatusException.class, () -> transactionService.createTransaction(request));
    }
}
