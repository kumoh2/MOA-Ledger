// setting_withdraw.js

document.addEventListener('DOMContentLoaded', async () => {
  const sessionStatus = await checkSession();
  if (sessionStatus === "Unauthorized!") {
    alert("로그인이 필요합니다.");
    window.location.href = 'login.html';
    return;
  }
  const container = document.getElementById('container');
  container.innerHTML = `
    <h2>회원 탈퇴</h2>
    <p>정말로 회원 탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
    <form id="withdraw-form">
      <div>
        <label for="password">비밀번호:</label>
        <input type="password" id="password" required>
      </div>
      <div>
        <label>
          <input type="checkbox" id="confirmCheckbox" required>
          회원 탈퇴 하시겠습니까?
        </label>
      </div>
      <button type="submit">회원 탈퇴</button>
    </form>
  `;
  const form = document.getElementById('withdraw-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // 백엔드에서는 세션 기반으로 회원 탈퇴를 처리합니다.
    const response = await fetch(`${BACKEND_URL}/auth/withdraw`, {
      method: "POST",
      credentials: "include"
    });
    const result = await response.text();
    alert(result);
    window.location.href = "../user/login.html";
  });
});
