import { checkLogin, db } from '../../js/utils/helpers.js';

// DOM 요소 선택
const groupTableBody = document.querySelector('#group-table tbody');
const selectedGroupNameSpan = document.querySelector('#selected-group-name');
const withdrawGroupBtn = document.querySelector('#withdraw-group-btn');

let selectedGroupId = null;

document.addEventListener('DOMContentLoaded', async () => {
  const currentUser = checkLogin();
  if (!currentUser) {
    alert('로그인이 필요합니다.');
    return;
  }

  // 그룹 목록 불러오기 (그룹 멤버 페이지와 동일한 방식)
  const userGroups = await fetchUserGroups(currentUser);
  displayGroups(userGroups);

  // 그룹 탈퇴 버튼 이벤트 처리
  withdrawGroupBtn.addEventListener('click', async () => {
    if (!selectedGroupId) {
      alert('먼저 탈퇴할 그룹을 선택해주세요.');
      return;
    }
    await withdrawGroup(currentUser, selectedGroupId);
  });
});

// 가입한 그룹들을 불러옴 (usergroup 테이블에서 외래키 관계를 통해 그룹 이름을 가져옴)
async function fetchUserGroups(userId) {
  const { data: userGroups, error } = await db
      .from('usergroup')
      .select('group_id, group:group_id (name)')
      .eq('user_id', userId);

  if (error) {
    console.error('❌ 그룹 조회 실패:', error);
    return [];
  }
  return userGroups;
}

// 그룹 목록을 테이블에 렌더링 (그룹 행 클릭 시 선택 처리)
function displayGroups(groups) {
  groupTableBody.innerHTML = '';

  groups.forEach(({ group_id, group }) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${group.name}</td>`;

    // 행 클릭 시 해당 그룹 선택 및 하이라이트 표시
    row.addEventListener('click', () => {
      selectedGroupId = group_id;
      selectedGroupNameSpan.innerText = group.name;

      // 모든 행의 highlight 초기화 후 선택한 행 강조
      document.querySelectorAll('#group-table tbody tr').forEach(tr => {
        tr.style.backgroundColor = '';
      });
      row.style.backgroundColor = '#e0e0e0';
    });

    groupTableBody.appendChild(row);
  });
}

// 그룹 탈퇴 (usergroup 테이블에서 해당 레코드 삭제)
async function withdrawGroup(userId, groupId) {
  const { data, error } = await db
      .from('usergroup')
      .delete()
      .eq('user_id', userId)
      .eq('group_id', groupId);

  if (error) {
    console.error('❌ 그룹 탈퇴 실패:', error);
    alert('그룹 탈퇴에 실패했습니다.');
    return;
  }

  alert('그룹 탈퇴 성공!');

  // 탈퇴 후 그룹 목록 새로고침 및 선택 초기화
  const updatedGroups = await fetchUserGroups(userId);
  displayGroups(updatedGroups);
  selectedGroupId = null;
  selectedGroupNameSpan.innerText = '없음';
}
