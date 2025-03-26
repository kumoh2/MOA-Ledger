package org.moa.ledger.service;

import jakarta.servlet.http.HttpSession;
import org.moa.ledger.mapper.UserMapper;
import org.moa.ledger.mapper.UserLedgerMapper;
import org.moa.ledger.model.User;
import org.moa.ledger.model.UserLedger;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserMapper userMapper;
    private final UserLedgerMapper userLedgerMapper;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserMapper userMapper, UserLedgerMapper userLedgerMapper) {
        this.userMapper = userMapper;
        this.userLedgerMapper = userLedgerMapper;
    }

    public boolean login(String userId, String password, HttpSession session) {
        User user = userMapper.findByUserId(userId);
        if (user != null && encoder.matches(password, user.getPassword())) {
            session.setAttribute("user", user.getUserId());
            return true;
        }
        return false;
    }

    public String register(User user) {
        if (userMapper.findByUserId(user.getUserId()) != null) {
            return "이미 존재하는 아이디입니다.";
        }
        // 비밀번호 암호화
        user.setPassword(encoder.encode(user.getPassword()));
        // 기본 닉네임 생성
        user.setNickname("닉네임_" + user.getUserId());
        int result = userMapper.insertUser(user);
        if (result > 0) {
            // 회원가입 후, userledger에 기본 메인 가계부 지정 (여기서는 group_id와 동일하게 설정)
            UserLedger ul = new UserLedger();
            ul.setUserId(user.getUserId());
            ul.setMainLedgerGroupId(user.getUserId());
            userLedgerMapper.insertUserLedger(ul);
            return "회원가입 성공! 로그인 해주세요.";
        }
        return "회원가입 실패";
    }

    public boolean updateProfile(User user) {
        int result = userMapper.updateUser(user);
        return result > 0;
    }

    public boolean withdraw(String userId) {
        int result = userMapper.deleteUser(userId);
        return result > 0;
    }

    public String getLoggedInUser(HttpSession session) {
        Object userId = session.getAttribute("user");
        return userId != null ? userId.toString() : null;
    }

    public User getUserById(String userId) {
        return userMapper.findByUserId(userId);
    }
}
