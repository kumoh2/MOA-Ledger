// views/user/login.js

import { login } from '../../js/utils/helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const result = await login(username, password);
      if (result.includes("successful")) {
        alert("로그인 성공!");
        window.location.href = '../main/main.html';
      } else {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    });
  }
});
