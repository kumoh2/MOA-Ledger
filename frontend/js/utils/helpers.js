// js/utils/helpers.js

// Render에 배포된 백엔드 주소
const BACKEND_URL = "https://api.moa.jhsoft.org";

// 로그인 API: userId와 password를 보내고, 백엔드에서 세션을 설정합니다.
export async function login(userId, password) {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    credentials: "include", // 세션 쿠키 자동 포함
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ userId, password })
  });

  return await response.text(); // 예: "Login successful" 또는 에러 메시지 반환
}

// 로그아웃 API: 세션을 종료합니다.
export async function logout() {
  await fetch(`${BACKEND_URL}/auth/logout`, {
    method: "POST",
    credentials: "include"
  });
}

// 세션 확인 API: 현재 세션 상태를 확인합니다.
export async function checkSession() {
  const response = await fetch(`${BACKEND_URL}/auth/secure-data`, {
    method: "GET",
    credentials: "include" // 세션 쿠키 포함
  });

  // 기존에는 `text()`를 썼지만, 이제 JSON 응답이므로 `json()` 사용
  const data = await response.json();
  return data;
  /*
    data 예시:
    {
      "status": "ok",
      "userId": "myUserId"
    }
    혹은
    {
      "status": "unauthorized"
    }
  */
}

// 공통 HTML 헤더를 로드하는 함수 (예: 공통 네비게이션)
export async function loadHTML() {
  const response = await fetch('../common/common.html');
  const html = await response.text();
  document.getElementById('top-section').innerHTML = html;
}

// 그룹 선택: 현재 사용자가 속한 그룹 목록을 백엔드 API로부터 받아 select box에 채웁니다.
export async function setupSelectGroup(currentUser) {
  // GET /group/user?userId=xxx (백엔드에서 사용자가 속한 그룹 목록 반환)
  const response = await fetch(`${BACKEND_URL}/group/user?userId=${currentUser}`, {
    method: "GET",
    credentials: "include"
  });
  const groups = await response.json(); // 예: [{ groupId, name }, ...]
  const groupSelect = document.getElementById('groupSelect');
  if (!groupSelect) {
    console.error('groupSelect 요소가 없습니다.');
    return;
  }
  groupSelect.innerHTML = '';
  groups.forEach(group => {
    const option = document.createElement('option');
    option.value = group.groupId;
    option.textContent = group.name;
    groupSelect.appendChild(option);
  });
}

// 사용자 닉네임 설정: 백엔드에서 사용자 정보를 조회하여 닉네임을 표시합니다.
export async function setupnickName(currentUser) {
  const response = await fetch(`${BACKEND_URL}/auth/userinfo?userId=${currentUser}`, {
    method: "GET",
    credentials: "include"
  });
  const data = await response.json();
  const nicknameEl = document.getElementById('nicknameSpan');
  if (nicknameEl && data.nickname) {
    nicknameEl.textContent = data.nickname + ' 님';
  }
}
