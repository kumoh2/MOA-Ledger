// group_member.js

document.addEventListener('DOMContentLoaded', async () => {
  const currentUser = await checkSession();
  if (currentUser === "Unauthorized!") {
    alert('로그인이 필요합니다.');
    window.location.href = '../user/login.html';
    return;
  }
  // 그룹 목록 조회: GET /group/user?userId=xxx
  const groupResponse = await fetch(`${BACKEND_URL}/group/user?userId=${currentUser}`, {
    method: "GET",
    credentials: "include"
  });
  const groups = await groupResponse.json();
  displayGroups(groups);
});

function displayGroups(groups) {
  const groupTableBody = document.querySelector('#group-table tbody');
  groupTableBody.innerHTML = '';
  groups.forEach(group => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${group.name}</td>`;
    tr.addEventListener('click', () => {
      // 그룹 선택 시 처리 (예: 구성원 조회 API 호출)
      console.log("선택된 그룹:", group.groupId);
    });
    groupTableBody.appendChild(tr);
  });
}
