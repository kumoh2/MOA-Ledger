// signup.js
// 회원가입 폼 제출 시 백엔드 API 호출
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userid = document.getElementById('reg-username').value.trim();
      const password = document.getElementById('reg-password').value.trim();
      const email = document.getElementById('reg-email').value.trim();

      if (!userid || !password || !email) {
        alert("아이디, 비밀번호, 이메일을 모두 입력해주세요.");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userid, password: password, email: email })
      });
      const result = await response.text();
      alert(result);
      if (result.includes("성공")) {
        window.location.href = 'login.html';
      }
    });
  }
});
