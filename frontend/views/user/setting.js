// views/user/setting.js

document.addEventListener('DOMContentLoaded', async () => {
  const sessionStatus = await checkSession();
  if (sessionStatus === "Unauthorized!") {
    alert("로그인이 필요합니다.");
    window.location.href = 'login.html';
    return;
  }
  // 실제 구현에서는 /auth/userinfo API로부터 사용자 정보를 가져와 currentUser 값을 설정합니다.
  // 예시로, currentUser를 sessionStatus에서 파싱하거나 별도 방법을 사용합니다.
  const currentUser = "추출된UserId"; // 실제로는 백엔드에서 가져와야 함.
  const response = await fetch(`${BACKEND_URL}/auth/userinfo?userId=${currentUser}`, {
    method: "GET",
    credentials: "include"
  });
  const userInfo = await response.json();

  const container = document.getElementById('container');
  container.innerHTML = `
    <h2>회원 정보 변경</h2>
    <form id="settings-form">
      <div>
        <label for="nickname">닉네임</label>
        <input type="text" id="nickname" name="nickname" placeholder="새 닉네임" required />
      </div>
      <div>
        <label for="email">이메일</label>
        <input type="email" id="email" name="email" placeholder="새 이메일" required />
      </div>
      <div>
        <label for="password">비밀번호</label>
        <input type="password" id="password" name="password" placeholder="새 비밀번호 (변경하지 않으려면 공백)"  />
      </div>
      <button type="submit">변경하기</button>
    </form>
  `;
  document.getElementById('nickname').value = userInfo.nickname || '';
  document.getElementById('email').value = userInfo.email || '';

  const form = document.getElementById('settings-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nickname = document.getElementById('nickname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const updateData = { userId: currentUser, nickname, email };
    if (password.trim()) {
      updateData.password = password;
    }
    const updateResponse = await fetch(`${BACKEND_URL}/auth/update`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData)
    });
    const updateResult = await updateResponse.text();
    alert(updateResult);
  });
});
