package com.example.moa.service;

import com.example.moa.entity.User;
import com.example.moa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(String userId, String rawPassword, String email) {
        if (userRepository.findById(userId).isPresent()) {
            throw new RuntimeException("이미 존재하는 사용자입니다.");
        }
        User newUser = new User();
        newUser.setUserId(userId);
        newUser.setPassword(passwordEncoder.encode(rawPassword));
        newUser.setEmail(email);
        newUser.setNickname(generateRandomNickname()); // 닉네임 생성 로직
        return userRepository.save(newUser);
    }

    public User login(String userId, String rawPassword) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        return user;
    }

    public User updateUser(String userId, String nickname, String email, String rawPassword) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
        user.setNickname(nickname);
        user.setEmail(email);
        if (rawPassword != null && !rawPassword.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(rawPassword));
        }
        return userRepository.save(user);
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    public User getUser(String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    private String generateRandomNickname() {
        // 필요한 닉네임 생성 로직
        return "새로운닉네임" + (int)(Math.random()*10000);
    }
}