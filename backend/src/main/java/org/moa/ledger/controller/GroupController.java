package com.example.moa.controller;

import com.example.moa.entity.Group;
import com.example.moa.service.GroupService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
public class GroupController {
    private final GroupService groupService;

    // 그룹 생성
    @PostMapping("/create")
    public String createGroup(@RequestParam String groupName, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return "로그인이 필요합니다.";
        }
        groupService.createGroup(userId, groupName);
        return "그룹 생성 완료!";
    }

    // 특정 유저가 속한 그룹 조회
    @GetMapping("/user")
    public List<GroupResponse> userGroups(@RequestParam String userId) {
        List<Group> groups = groupService.findUserGroups(userId);
        return groups.stream()
                .map(g -> new GroupResponse(g.getGroupId(), g.getName()))
                .collect(Collectors.toList());
    }

    // 그룹원 추가
    @PostMapping("/add-member")
    public String addMember(@RequestParam String groupId,
                            @RequestParam String targetUserId,
                            @RequestParam(defaultValue="member") String role,
                            HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) return "로그인이 필요합니다.";
        // (권한 체크) userId가 해당 group의 leader인지 확인 로직 등
        groupService.addUserToGroup(groupId, targetUserId, role);
        return "그룹 멤버 추가 성공!";
    }

    // 그룹원 제거
    @PostMapping("/remove-member")
    public String removeMember(@RequestParam String groupId,
                               @RequestParam String targetUserId,
                               HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) return "로그인이 필요합니다.";
        groupService.removeUserFromGroup(groupId, targetUserId);
        return "그룹 멤버 제거 성공!";
    }

    // 그룹장 위임
    @PostMapping("/delegate-leader")
    public String delegateLeader(@RequestParam String groupId,
                                 @RequestParam String newLeaderId,
                                 HttpSession session) {
        String currentLeaderId = (String) session.getAttribute("userId");
        if (currentLeaderId == null) return "로그인이 필요합니다.";

        groupService.delegateLeader(groupId, currentLeaderId, newLeaderId);
        return "그룹장 위임 완료!";
    }

    // 그룹 탈퇴
    @PostMapping("/withdraw")
    public String withdraw(@RequestParam String groupId, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) return "로그인이 필요합니다.";
        groupService.withdrawGroup(userId, groupId);
        return "그룹 탈퇴 성공!";
    }

    record GroupResponse(String groupId, String name){}
}