import { checkSession, loadHTML, setupSelectGroup, setupnickName } from '../../js/utils/helpers.js';
const BACKEND_URL = "https://api.moa.jhsoft.org"; // 혹은 로컬 환경: http://localhost:8080

document.addEventListener('DOMContentLoaded', async () => {
    // 세션 확인
    const sessionData = await checkSession();
    if (sessionData.status !== 'ok') {
        alert("로그인이 필요합니다.");
        window.location.href = '../user/login.html';
        return;
    }
    const currentUser = sessionData.userId;
    // 공통 UI 처리
    await loadHTML();
    // logout 버튼 이벤트, groupSelect, nickname 표시 등 (필요한 부분 구현)
    await setupSelectGroup(currentUser);
    await setupnickName(currentUser);

    // ledger 내역 불러오기
    dbbring();
});

async function dbbring() {
    const groupId = localStorage.getItem('selectedGroup'); // 또는 document.getElementById('groupSelect').value
    // Spring Boot API: GET /ledger/group?groupId=xxx
    const response = await fetch(`${BACKEND_URL}/ledger/group?groupId=${groupId}`, {
        method: "GET",
        credentials: "include"
    });
    const data = await response.json();

    const table = document.getElementById('itemTable');
    data.forEach(item => {
        const row = `
      <tr>
        <td style="display:none;">${item.userId}</td>
        <td>${item.userId}</td> 
        <!-- nickname 가져오려면 서버 측에서 별도 처리 or userinfo join 로직 필요 -->
        <td>${item.transactionType}</td>
        <td>${item.transactionDate}</td>
        <td>${item.description}</td>
        <td>${item.amount}</td>
      </tr>`;
        table.innerHTML += row;
    });
}