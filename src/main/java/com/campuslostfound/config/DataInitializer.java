package com.campuslostfound.config;

import com.campuslostfound.model.Claim;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.ClaimRepository;
import com.campuslostfound.repository.ItemRepository;
import com.campuslostfound.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ClaimRepository claimRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final SampleDataSeeder sampleDataSeeder;

    @Override
    public void run(String... args) {
        // 1. Create Default Admin if not present
        User admin = userRepository.findByEmail("admin@campus.edu").orElseGet(() -> {
            User newAdmin = User.builder()
                    .fullName("System Administrator")
                    .collegeId("ADMIN001")
                    .email("admin@campus.edu")
                    .phone("9876543210")
                    .department("Administration")
                    .yearOfStudy("Staff")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.UserRole.ADMIN)
                    .enabled(true)
                    .emailVerified(true)
                    .build();
            return userRepository.save(newAdmin);
        });

        // 2. Create Default Student User
        User student = userRepository.findByEmail("student@campus.edu").orElseGet(() -> {
            User newStudent = User.builder()
                    .fullName("Aarav Sharma")
                    .collegeId("CS202401")
                    .email("student@campus.edu")
                    .phone("9876543211")
                    .department("Computer Science")
                    .yearOfStudy("3rd Year")
                    .password(passwordEncoder.encode("student123"))
                    .role(User.UserRole.STUDENT)
                    .enabled(true)
                    .emailVerified(true)
                    .build();
            return userRepository.save(newStudent);
        });

        // 3. Create Default Staff User
        User staff = userRepository.findByEmail("staff@campus.edu").orElseGet(() -> {
            User newStaff = User.builder()
                    .fullName("Prof. Rajesh Nair")
                    .collegeId("STAFF102")
                    .email("staff@campus.edu")
                    .phone("9876543212")
                    .department("Physics")
                    .yearOfStudy("Staff")
                    .password(passwordEncoder.encode("staff123"))
                    .role(User.UserRole.STAFF)
                    .enabled(true)
                    .emailVerified(true)
                    .build();
            return userRepository.save(newStaff);
        });

        // 4. Seed 50 unique lost items, 20 unique found items and quizzes
        sampleDataSeeder.seedDemoDataIfNecessary(student, staff);

        log.info("=================================================");
        log.info("  CAMPUS LOST & FOUND - READY");
        log.info("  Admin:   admin@campus.edu   / admin123");
        log.info("  Student: student@campus.edu / student123");
        log.info("  Staff:   staff@campus.edu   / staff123");
        log.info("=================================================");
    }
}
