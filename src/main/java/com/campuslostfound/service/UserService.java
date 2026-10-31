package com.campuslostfound.service;

import com.campuslostfound.dto.UserRegistrationDto;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public User registerUser(UserRegistrationDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered: " + dto.getEmail());
        }
        if (userRepository.existsByCollegeId(dto.getCollegeId())) {
            throw new RuntimeException("College ID already registered: " + dto.getCollegeId());
        }
        if (!dto.passwordsMatch()) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = User.builder()
                .fullName(dto.getFullName())
                .collegeId(dto.getCollegeId())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .department(dto.getDepartment())
                .yearOfStudy(dto.getYearOfStudy())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole() != null ? dto.getRole() : User.UserRole.STUDENT)
                .enabled(true)
                .emailVerified(false)
                .build();

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean collegeIdExists(String collegeId) {
        return userRepository.existsByCollegeId(collegeId);
    }

    @Transactional(readOnly = true)
    public long getTotalUsers() {
        return userRepository.count();
    }

    @Transactional(readOnly = true)
    public long countByRole(User.UserRole role) {
        return userRepository.countByRole(role);
    }

    public void toggleUserStatus(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setEnabled(!user.isEnabled());
            userRepository.save(user);
        });
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}

