import { checkLogin, db } from '../../js/utils/helpers.js';

// DOM 요소 선택
const leaderGroupTableBody = document.querySelector('#leader-group-table tbody');
const selectedLeaderGroupNameSpan = document.querySelector('#selected-leader-group-name');
const memberTableBody = document.querySelector('#member-table tbody');
const selectedMemberNameSpan = document.querySelector('#selected-member-name');
const delegateBtn = document.querySelector('#delegate-btn');

let selectedGroupId = null;
let selectedMemberId = null;
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  currentUser = checkLogin();

  // 현재 사용자가 리더인 그룹 목록 조회
  const leaderGroups = await fetchLeaderGroups(currentUser);
  displayLeaderGroups(leaderGroups);

  // 그룹 위임 버튼 이벤트 처리
  delegateBtn.addEventListener('click', async () => {
    if (!selectedGroupId) {
      alert('먼저 그룹을 선택해주세요.');
      return;
    }
    if (!selectedMemberId) {
      alert('먼저 위임할 구성원을 선택해주세요.');
      return;
    }
    await delegateLeadership(selectedGroupId, currentUser, selectedMemberId);
  });
});

// 현재 사용자가 리더(role가 "leader")인 그룹들을 가져옴
async function fetchLeaderGroups(userId) {
  const { data, error } = await db
      .from('usergroup')
      .select('group_id, group:group_id (name)')
      .eq('user_id', userId)
      .eq('role', 'leader');
  if (error) {
    console.error('리더 그룹 조회 실패:', error);
    return [];
  }
  return data;
}

// 리더 그룹 목록을 테이블에 렌더링
function displayLeaderGroups(groups) {
  leaderGroupTableBody.innerHTML = '';
  groups.forEach(({ group_id, group }) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${group.name}</td>`;
    row.addEventListener('click', () => {
      selectedGroupId = group_id;
      selectedLeaderGroupNameSpan.innerText = group.name;
      // 하이라이트 효과 적용
      document.querySelectorAll('#leader-group-table tbody tr').forEach(tr => {
        tr.style.backgroundColor = '';
      });
      row.style.backgroundColor = '#e0e0e0';

      // 선택된 그룹의 구성원 목록을 불러옴 (현재 리더 제외)
      fetchAndDisplayMembers(group_id);
    });
    leaderGroupTableBody.appendChild(row);
  });
}

// 선택된 그룹의 구성원 목록을 불러옴 (현재 리더 제외)
async function fetchAndDisplayMembers(groupId) {
  const { data, error } = await db
      .from('usergroup')
      .select('user_id, user:user_id (nickname, user_id)')
      .eq('group_id', groupId)
      .neq('user_id', currentUser);
  if (error) {
    console.error('그룹 구성원 조회 실패:', error);
    return;
  }
  displayMembers(data);
}

// 구성원 목록을 테이블에 렌더링
function displayMembers(members) {
  memberTableBody.innerHTML = '';
  selectedMemberId = null;
  selectedMemberNameSpan.innerText = '없음';

  members.forEach(({ user_id, user }) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${user.nickname}</td>`;
    row.addEventListener('click', () => {
      selectedMemberId = user_id;
      selectedMemberNameSpan.innerText = user.nickname;
      // 하이라이트 효과 적용
      document.querySelectorAll('#member-table tbody tr').forEach(tr => {
        tr.style.backgroundColor = '';
      });
      row.style.backgroundColor = '#e0e0e0';
    });
    memberTableBody.appendChild(row);
  });
}

// 그룹장 위임 처리 함수
async function delegateLeadership(groupId, currentLeaderId, newLeaderId) {
  // 현재 리더의 role을 "member"로 업데이트
  const { data: updateCurrent, error: errorCurrent } = await db
      .from('usergroup')
      .update({ role: 'member' })
      .eq('group_id', groupId)
      .eq('user_id', currentLeaderId);
  if (errorCurrent) {
    console.error('현재 리더 업데이트 실패:', errorCurrent);
    alert('리더 위임에 실패했습니다.');
    return;
  }

  // 선택한 구성원의 role을 "leader"로 업데이트
  const { data: updateNew, error: errorNew } = await db
      .from('usergroup')
      .update({ role: 'leader' })
      .eq('group_id', groupId)
      .eq('user_id', newLeaderId);
  if (errorNew) {
    console.error('새 리더 업데이트 실패:', errorNew);
    alert('리더 위임에 실패했습니다.');
    return;
  }

  alert('그룹장 위임에 성공했습니다!');

  // 위임 후 현재 사용자가 리더인 그룹 목록을 갱신(현재 그룹은 제외됨)
  const leaderGroups = await fetchLeaderGroups(currentUser.id);
  displayLeaderGroups(leaderGroups);

  // 구성원 목록 및 선택 정보 초기화
  memberTableBody.innerHTML = '';
  selectedGroupId = null;
  selectedLeaderGroupNameSpan.innerText = '없음';
  selectedMemberId = null;
  selectedMemberNameSpan.innerText = '없음';
}
