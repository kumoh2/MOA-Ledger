// views/user/group_create.js

document.addEventListener('DOMContentLoaded', async () => {
  const sessionStatus = await checkSession();
  if (sessionStatus === "Unauthorized!") {
    alert("로그인이 필요합니다.");
    window.location.href = 'login.html';
    return;
  }
  const form = document.getElementById('groupform');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const groupName = document.getElementById('group-name').value.trim();
      if (!groupName) {
        alert('그룹 이름을 입력해주세요.');
        return;
      }
      const response = await fetch(`${BACKEND_URL}/group/create?groupName=${encodeURIComponent(groupName)}`, {
        method: "POST",
        credentials: "include"
      });
      const result = await response.text();
      alert(result);
      window.location.reload();
    });
  }
});
