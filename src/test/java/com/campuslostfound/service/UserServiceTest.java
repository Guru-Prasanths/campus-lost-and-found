package com.campuslostfound.service;

import com.campuslostfound.dto.UserRegistrationDto;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserRegistrationDto validDto;

    @BeforeEach
    void setUp() {
        validDto = UserRegistrationDto.builder()
                .fullName("Test Student")
                .collegeId("CS9999")
                .email("test.student@campus.edu")
                .phone("9876543210")
                .department("Computer Science")
                .yearOfStudy("2nd Year")
                .password("password123")
                .confirmPassword("password123")
                .role(User.UserRole.STUDENT)
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new student user")
    void registerUser_Success() {
        when(userRepository.existsByEmail(validDto.getEmail())).thenReturn(false);
        when(userRepository.existsByCollegeId(validDto.getCollegeId())).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$10$encodedHashString");

        User savedUser = User.builder()
                .id(1L)
                .fullName(validDto.getFullName())
                .collegeId(validDto.getCollegeId())
                .email(validDto.getEmail())
                .password("$2a$10$encodedHashString")
                .role(User.UserRole.STUDENT)
                .enabled(true)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.registerUser(validDto);

        assertNotNull(result);
        assertEquals("test.student@campus.edu", result.getEmail());
        assertEquals("CS9999", result.getCollegeId());
        assertTrue(result.isEnabled());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when email is already registered")
    void registerUser_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail(validDto.getEmail())).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.registerUser(validDto));
        assertTrue(ex.getMessage().contains("Email already registered"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when College ID is already registered")
    void registerUser_DuplicateCollegeId_ThrowsException() {
        when(userRepository.existsByEmail(validDto.getEmail())).thenReturn(false);
        when(userRepository.existsByCollegeId(validDto.getCollegeId())).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.registerUser(validDto));
        assertTrue(ex.getMessage().contains("College ID already registered"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when passwords do not match")
    void registerUser_PasswordMismatch_ThrowsException() {
        validDto.setConfirmPassword("differentPassword");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.registerUser(validDto));
        assertTrue(ex.getMessage().contains("Passwords do not match"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should toggle user active/enabled status")
    void toggleUserStatus_Success() {
        User user = User.builder().id(10L).enabled(true).build();
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));

        userService.toggleUserStatus(10L);

        assertFalse(user.isEnabled());
        verify(userRepository, times(1)).save(user);
    }
}

