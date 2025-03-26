package org.moa.ledger.controller;

import jakarta.servlet.http.HttpSession;
import org.moa.ledger.model.User;
import org.moa.ledger.service.AuthService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public String login(@RequestParam String userId, @RequestParam String password, HttpSession session) {
        boolean success = authService.login(userId, password, session);
        return success ? "Login successful" : "Invalid username or password";
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logged out successfully!";
    }

    @PostMapping("/update")
    public String update(@RequestBody User user, HttpSession session) {
        String currentUser = authService.getLoggedInUser(session);
        if (currentUser == null || !currentUser.equals(user.getUserId())) {
            return "Unauthorized";
        }
        boolean result = authService.updateProfile(user);
        return result ? "Profile updated" : "Update failed";
    }

    @PostMapping("/withdraw")
    public String withdraw(HttpSession session) {
        String userId = authService.getLoggedInUser(session);
        if (userId == null) {
            return "Not logged in";
        }
        boolean result = authService.withdraw(userId);
        if (result) {
            session.invalidate();
            return "Account deleted";
        }
        return "Deletion failed";
    }

    @GetMapping("/userinfo")
    public User getUserInfo(@RequestParam String userId) {
        // userId를 기반으로 사용자 전체 정보를 조회
        User user = authService.getUserById(userId);
        if (user != null) {
            // 보안을 위해 비밀번호 필드는 null로 처리
            user.setPassword(null);
        }
        return user;
    }

    @GetMapping("/secure-data")
     public Map<String, String> secureData(HttpSession session) {
         String userId = authService.getLoggedInUser(session);
         Map<String, String> resp = new HashMap<>();
         if (userId != null) {
             resp.put("status", "ok");
             resp.put("userId", userId);
         } else {
             resp.put("status", "unauthorized");
         }
         return resp;
     }
}
