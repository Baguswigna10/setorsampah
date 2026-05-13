package com.example.setorsampah.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.example.setorsampah.dto.TransactionResponse;
import com.example.setorsampah.dto.TransactionResponseItem;
import com.example.setorsampah.model.TransactionDetail;
import com.example.setorsampah.model.WasteTransaction;

public class TransactionMapper {

    public static TransactionResponse toResponse(WasteTransaction transaction) {
        if (transaction == null) {
            return null;
        }
        List<TransactionResponseItem> items = transaction.getDetails().stream()
                .map(TransactionMapper::toItemResponse)
                .collect(Collectors.toList());
        return new TransactionResponse(transaction.getId(), transaction.getUser().getId(), transaction.getBank().getId(), transaction.getTotalWeight(), transaction.getTotalPoint(), transaction.getTransactionDate(), items);
    }

    private static TransactionResponseItem toItemResponse(TransactionDetail detail) {
        if (detail == null) {
            return null;
        }
        return new TransactionResponseItem(detail.getCategory().getId(), detail.getCategory().getName(), detail.getWeight(), detail.getPoint());
    }
}
