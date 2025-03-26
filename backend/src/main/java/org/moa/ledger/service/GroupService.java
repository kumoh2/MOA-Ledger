package com.example.moa.service;

import com.example.moa.entity.Group;
import com.example.moa.entity.UserGroup;
import com.example.moa.repository.GroupRepository;
import com.example.moa.repository.UserGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {
    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository;

    // 그룹 생성
    public Group createGroup(String userId, String groupName) {
        // group_id는 예: userId + 랜덤, 혹은 UUID
        String groupId = userId + "_" + groupName;
        Group group = new Group(groupId, groupName, userId);
        groupRepository.save(group);

        // group의 leader로 user를 추가
        UserGroup ug = new UserGroup();
        ug.setGroupId(groupId);
        ug.setUserId(userId);
        ug.setRole("leader");
        userGroupRepository.save(ug);

        return group;
    }

    // 사용자가 리더인 그룹들 조회
    public List<Group> findLeaderGroups(String userId) {
        List<UserGroup> list = userGroupRepository.findByUserIdAndRole(userId, "leader");
        return list.stream()
                .map(ug -> groupRepository.findById(ug.getGroupId()).orElse(null))
                .filter(g -> g != null)
                .collect(Collectors.toList());
    }

    // 특정 사용자가 속한 그룹 목록 조회
    public List<Group> findUserGroups(String userId) {
        List<UserGroup> list = userGroupRepository.findByUserId(userId);
        return list.stream()
                .map(ug -> groupRepository.findById(ug.getGroupId()).orElse(null))
                .filter(g -> g != null)
                .collect(Collectors.toList());
    }

    // 그룹에 사용자 추가
    public void addUserToGroup(String groupId, String userId, String role) {
        // 중복 체크 등 추가 가능
        UserGroup ug = new UserGroup();
        ug.setGroupId(groupId);
        ug.setUserId(userId);
        ug.setRole(role);
        userGroupRepository.save(ug);
    }

    // 그룹에서 사용자 제거
    public void removeUserFromGroup(String groupId, String userId) {
        userGroupRepository.deleteByUserIdAndGroupId(userId, groupId);
    }

    // 그룹장 위임
    public void delegateLeader(String groupId, String currentLeaderId, String newLeaderId) {
        // 현재 리더 -> member
        List<UserGroup> currentLeaderRecords = userGroupRepository.findByUserIdAndRole(currentLeaderId, "leader");
        for (UserGroup ug : currentLeaderRecords) {
            if (ug.getGroupId().equals(groupId)) {
                ug.setRole("member");
                userGroupRepository.save(ug);
            }
        }
        // 새 리더 -> leader
        List<UserGroup> newLeaderRecords = userGroupRepository.findByUserId(newLeaderId);
        for (UserGroup ug : newLeaderRecords) {
            if (ug.getGroupId().equals(groupId)) {
                ug.setRole("leader");
                userGroupRepository.save(ug);
            }
        }
        // group 테이블 leaderId도 갱신
        Group group = groupRepository.findById(groupId).orElse(null);
        if (group != null) {
            group.setLeaderId(newLeaderId);
            groupRepository.save(group);
        }
    }

    // 그룹 탈퇴
    public void withdrawGroup(String userId, String groupId) {
        // leader인 경우 탈퇴 불가 처리 등 로직 가능
        removeUserFromGroup(groupId, userId);
    }
}