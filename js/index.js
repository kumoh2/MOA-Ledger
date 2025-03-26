// js/index.js
import { checkSession } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const sessionResponse = await checkSession(); // ✅ 세션 확인 API 호출
        if (sessionResponse.status === 'ok') {
            // ✅ 로그인 상태라면 메인 페이지로 이동
            window.location.href = './views/main/main.html';
        } else {
            // ✅ 로그인 안 되어 있으면 로그인 페이지로 이동
            window.location.href = './views/user/login.html';
        }
    } catch (error) {
        console.error("세션 확인 중 오류 발생:", error);
        window.location.href = './views/user/login.html';
    }
});
