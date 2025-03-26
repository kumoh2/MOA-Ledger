package org.moa.ledger.service;

import org.moa.ledger.mapper.GroupMapper;
import org.moa.ledger.mapper.UserGroupMapper;
import org.moa.ledger.model.Group;
import org.moa.ledger.model.UserGroup;
import org.springframework.stereotype.Service;

@Service
public class GroupService {
    private final GroupMapper groupMapper;
    private final UserGroupMapper userGroupMapper;

    public GroupService(GroupMapper groupMapper, UserGroupMapper userGroupMapper) {
        this.groupMapper = groupMapper;
        this.userGroupMapper = userGroupMapper;
    }

    public String createGroup(String groupName, String leaderId) {
        // 그룹 아이디: leaderId + "_" + groupName
        String groupId = leaderId + "_" + groupName;
        Group group = new Group();
        group.setGroupId(groupId);
        group.setName(groupName);
        group.setLeaderId(leaderId);
        int result = groupMapper.insertGroup(group);
        if (result > 0) {
            // 그룹 생성 후, 연결 테이블(usergroup)에 leader 추가
            UserGroup ug = new UserGroup();
            ug.setUserId(leaderId);
            ug.setGroupId(groupId);
            ug.setRole("leader");
            userGroupMapper.insertUserGroup(ug);
            return groupId;
        }
        return null;
    }

    // 추가: 그룹에 사용자 추가, 삭제, 그룹장 위임 등 기능을 구현할 수 있습니다.
}
