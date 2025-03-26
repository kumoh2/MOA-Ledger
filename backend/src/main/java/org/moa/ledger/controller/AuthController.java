package com.example.moa.controller;

import com.example.moa.entity.User;
import com.example.moa.service.AuthService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    // 회원가입
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {
        try {
            authService.registerUser(req.getUserId(), req.getPassword(), req.getEmail());
            return "회원가입 성공!";
        } catch (Exception e) {
            return "회원가입 실패: " + e.getMessage();
        }
    }

    // 로그인 (세션 유지)
    @PostMapping("/login")
    public String login(@RequestParam String userId,
                        @RequestParam String password,
                        HttpSession session) {
        try {
            User user = authService.login(userId, password);
            // 세션에 userId 저장
            session.setAttribute("userId", user.getUserId());
            return "Login successful";
        } catch (Exception e) {
            return "Login failed: " + e.getMessage();
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logout successful";
    }

    // 현재 세션 확인용 API (프론트엔드에서 checkSession() 시 호출)
    @GetMapping("/secure-data")
    public SessionStatusResponse secureData(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return new SessionStatusResponse("unauthorized", null);
        }
        return new SessionStatusResponse("ok", userId);
    }

    // 사용자 정보 조회
    @GetMapping("/userinfo")
    public UserInfoResponse userinfo(@RequestParam String userId) {
        User user = authService.getUser(userId);
        if (user == null) {
            return new UserInfoResponse("", "", "NoUser");
        }
        return new UserInfoResponse(user.getNickname(), user.getEmail(), "OK");
    }

    // 회원정보 업데이트
    @PostMapping("/update")
    public String updateUser(@RequestBody UpdateRequest req) {
        try {
            authService.updateUser(req.getUserId(), req.getNickname(), req.getEmail(), req.getPassword());
            return "회원 정보가 성공적으로 변경되었습니다!";
        } catch (Exception e) {
            return "업데이트 실패: " + e.getMessage();
        }
    }

    // 회원 탈퇴
    @PostMapping("/withdraw")
    public String withdraw(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return "로그인이 필요합니다.";
        }
        authService.deleteUser(userId);
        session.invalidate();
        return "회원 탈퇴가 완료되었습니다.";
    }

    // DTO 클래스들
    static record RegisterRequest(String userId, String password, String email) {}
    static record UpdateRequest(String userId, String nickname, String email, String password) {}
    static record SessionStatusResponse(String status, String userId) {}
    static record UserInfoResponse(String nickname, String email, String status) {}
}