package org.moa.ledger.controller;

import jakarta.servlet.http.HttpSession;
import org.moa.ledger.service.GroupService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/group")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping("/create")
    public String createGroup(@RequestParam String groupName, HttpSession session) {
        String leaderId = (String) session.getAttribute("user");
        if (leaderId == null) {
            return "Unauthorized";
        }
        String groupId = groupService.createGroup(groupName, leaderId);
        return groupId != null ? "Group created with ID: " + groupId : "Group creation failed";
    }

    // 그룹 목록 조회: GET /group/user?userId=xxx
    // 실제 구현에서는 usergroup 테이블과 조인하여 그룹 목록을 반환해야 합니다.
}
