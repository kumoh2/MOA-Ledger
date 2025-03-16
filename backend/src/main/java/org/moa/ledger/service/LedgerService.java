package org.moa.ledger.service;

import org.moa.ledger.mapper.LedgerMapper;
import org.moa.ledger.model.Ledger;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LedgerService {
    private final LedgerMapper ledgerMapper;

    public LedgerService(LedgerMapper ledgerMapper) {
        this.ledgerMapper = ledgerMapper;
    }

}
