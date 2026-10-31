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

        // 4. Seed sample items if items table is empty
        if (itemRepository.count() == 0) {
            Item item1 = Item.builder()
                    .itemName("Apple MacBook Pro 14\" (Space Gray)")
                    .category(Item.Category.ELECTRONICS)
                    .description("Space Gray MacBook Pro with M2 Pro chip left on a study desk on the second floor.")
                    .location("Central Library, 2nd Floor Silent Zone")
                    .date(LocalDate.now().minusDays(1))
                    .approximateTime(LocalTime.of(15, 30))
                    .itemType(Item.ItemType.LOST)
                    .status(Item.ItemStatus.ACTIVE)
                    .imagePath("macbook-pro.jpg")
                    .privateDetails("Serial # C02G789XYZ, Sticker of GitHub Octocat on bottom right corner, blue sleeve case.")
                    .reportedBy(student)
                    .build();

            Item item2 = Item.builder()
                    .itemName("Student ID Card - CSE Department")
                    .category(Item.Category.ID_CARDS)
                    .description("Found a laminated student identity card near the billing counter.")
                    .location("Main Campus Canteen")
                    .date(LocalDate.now().minusDays(2))
                    .approximateTime(LocalTime.of(13, 15))
                    .itemType(Item.ItemType.FOUND)
                    .status(Item.ItemStatus.ACTIVE)
                    .imagePath("student-id.jpg")
                    .privateDetails("Name: Rohan K., Roll CS23045, barcode ending in 7741.")
                    .reportedBy(staff)
                    .build();

            Item item3 = Item.builder()
                    .itemName("Blue Leather Bi-Fold Wallet")
                    .category(Item.Category.WALLETS_MONEY)
                    .description("Found a dark navy/blue leather wallet on a bench next to basketball court.")
                    .location("Sports Complex - Basketball Court")
                    .date(LocalDate.now().minusDays(3))
                    .approximateTime(LocalTime.of(17, 45))
                    .itemType(Item.ItemType.FOUND)
                    .status(Item.ItemStatus.ACTIVE)
                    .imagePath("leather-wallet.jpg")
                    .privateDetails("Contains Rs. 650 cash, SBI debit card in front pocket, a college bus pass.")
                    .reportedBy(student)
                    .build();

            Item item4 = Item.builder()
                    .itemName("Sony WH-1000XM4 Noise Canceling Headphones")
                    .category(Item.Category.ELECTRONICS)
                    .description("Black over-ear headphones in zippered hardshell case.")
                    .location("Auditorium Hall B, Row 4")
                    .date(LocalDate.now().minusDays(4))
                    .approximateTime(LocalTime.of(11, 0))
                    .itemType(Item.ItemType.LOST)
                    .status(Item.ItemStatus.ACTIVE)
                    .imagePath("sony-headphones.jpg")
                    .privateDetails("Small scratch on left ear cup hinge, contains braided 3.5mm audio cable inside case.")
                    .reportedBy(staff)
                    .build();

            Item item5 = Item.builder()
                    .itemName("Data Structures & Algorithms Hardcover Notes")
                    .category(Item.Category.BOOKS_NOTES)
                    .description("Thick spiral bound notebook with green cover containing handwritten semester notes.")
                    .location("Block C - Room 302")
                    .date(LocalDate.now().minusDays(5))
                    .approximateTime(LocalTime.of(16, 20))
                    .itemType(Item.ItemType.LOST)
                    .status(Item.ItemStatus.RETURNED)
                    .imagePath("dsa-notes.jpg")
                    .privateDetails("First page inscribed with 'Semester 4 DS Notes'.")
                    .reportedBy(student)
                    .build();

            Item savedItem1 = itemRepository.save(item1);
            Item savedItem2 = itemRepository.save(item2);
            itemRepository.save(item3);
            itemRepository.save(item4);
            itemRepository.save(item5);

            // 5. Seed sample claim
            Claim claim = Claim.builder()
                    .item(savedItem2)
                    .claimant(student)
                    .proofOfOwnership("This is my classmate Rohan's card. My friend was looking for his ID card lost during lunch hours.")
                    .additionalInfo("He can come with me to the admin counter with his alternate government ID.")
                    .status(Claim.ClaimStatus.PENDING)
                    .build();
            claimRepository.save(claim);

            log.info("Sample items and claims seeded successfully.");
        }

        // 6. Ensure all existing items have realistic photos if unassigned
        itemRepository.findAll().forEach(item -> {
            if (item.getImagePath() == null || item.getImagePath().isBlank()) {
                String name = item.getItemName().toLowerCase();
                if (name.contains("macbook") || name.contains("laptop")) {
                    item.setImagePath("macbook-pro.jpg");
                } else if (name.contains("id card") || name.contains("card")) {
                    item.setImagePath("student-id.jpg");
                } else if (name.contains("wallet")) {
                    item.setImagePath("leather-wallet.jpg");
                } else if (name.contains("headphone") || name.contains("sony")) {
                    item.setImagePath("sony-headphones.jpg");
                } else if (name.contains("note") || name.contains("book")) {
                    item.setImagePath("dsa-notes.jpg");
                } else if (name.contains("bottle") || name.contains("flask")) {
                    item.setImagePath("water-bottle.jpg");
                } else if (name.contains("calculator")) {
                    item.setImagePath("calculator.jpg");
                } else if (name.contains("backpack") || name.contains("bag")) {
                    item.setImagePath("college-backpack.jpg");
                } else if (name.contains("key")) {
                    item.setImagePath("keys-keychain.jpg");
                }
                if (item.getImagePath() != null) {
                    itemRepository.save(item);
                }
            }
        });

        log.info("=================================================");
        log.info("  CAMPUS LOST & FOUND - READY");
        log.info("  Admin:   admin@campus.edu   / admin123");
        log.info("  Student: student@campus.edu / student123");
        log.info("  Staff:   staff@campus.edu   / staff123");
        log.info("=================================================");
    }
}
