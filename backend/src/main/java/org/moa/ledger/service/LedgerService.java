package com.example.moa.service;

import com.example.moa.entity.Ledger;
import com.example.moa.repository.LedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LedgerService {
    private final LedgerRepository ledgerRepository;

    public Ledger createLedger(String groupId, String userId, String transactionType,
                               LocalDate transactionDate, String category, Long amount, String description) {
        Ledger ledger = new Ledger();
        ledger.setGroupId(groupId);
        ledger.setUserId(userId);
        ledger.setTransactionType(transactionType);
        ledger.setTransactionDate(transactionDate);
        ledger.setCategory(category);
        ledger.setAmount(amount);
        ledger.setDescription(description);
        return ledgerRepository.save(ledger);
    }

    public List<Ledger> findByGroup(String groupId) {
        return ledgerRepository.findByGroupId(groupId);
    }

    public List<Ledger> findByUserAndGroup(String userId, String groupId) {
        return ledgerRepository.findByGroupIdAndUserId(groupId, userId);
    }

    public void deleteLedger(Long ledgerId) {
        ledgerRepository.deleteById(ledgerId);
    }

    // 필요하면 update, etc...
}