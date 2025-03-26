package com.example.moa.controller;

import com.example.moa.entity.Ledger;
import com.example.moa.service.LedgerService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ledger")
@RequiredArgsConstructor
public class LedgerController {
    private final LedgerService ledgerService;

    // 가계부 등록
    @PostMapping("/create")
    public String createLedger(@RequestBody LedgerRequest req, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return "로그인이 필요합니다.";
        }
        ledgerService.createLedger(
                req.groupId(),
                userId,
                req.transactionType(),
                LocalDate.parse(req.transactionDate()),
                req.category(),
                req.amount(),
                req.description()
        );
        return "가계부 내역 등록 완료!";
    }

    // 특정 그룹의 ledger 조회
    @GetMapping("/group")
    public List<LedgerResponse> groupLedger(@RequestParam String groupId) {
        List<Ledger> list = ledgerService.findByGroup(groupId);
        return list.stream().map(LedgerResponse::from).collect(Collectors.toList());
    }

    // ledger 삭제
    @DeleteMapping("/{ledgerId}")
    public String deleteLedger(@PathVariable Long ledgerId, HttpSession session) {
        // 세션 체크, 권한 체크 등
        ledgerService.deleteLedger(ledgerId);
        return "Ledger 삭제 완료";
    }

    // etc. 필요 시 추가

    record LedgerRequest(String groupId,
                         String transactionType,
                         String transactionDate,
                         String category,
                         Long amount,
                         String description){}

    record LedgerResponse(Long ledgerId,
                          String groupId,
                          String userId,
                          String transactionType,
                          String transactionDate,
                          String category,
                          Long amount,
                          String description){

        public static LedgerResponse from(Ledger l) {
            return new LedgerResponse(
                    l.getLedgerId(),
                    l.getGroupId(),
                    l.getUserId(),
                    l.getTransactionType(),
                    l.getTransactionDate().toString(),
                    l.getCategory(),
                    l.getAmount(),
                    l.getDescription()
            );
        }
    }
}