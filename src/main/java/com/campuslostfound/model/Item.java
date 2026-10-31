package com.campuslostfound.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Item name is required")
    @Size(max = 150, message = "Item name must be less than 150 characters")
    @Column(nullable = false)
    private String itemName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @NotBlank(message = "Description is required")
    @Size(max = 2000)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate date;

    @Column
    private LocalTime approximateTime;

    @Column
    private String imagePath;

    @JsonIgnore
    @Column(columnDefinition = "TEXT")
    private String privateDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType itemType;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status = ItemStatus.ACTIVE;

    @Builder.Default
    @Column(name = "is_demo", nullable = false)
    private boolean isDemo = false;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_id", nullable = false)
    private User reportedBy;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Claim> claims;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuizQuestion> quizQuestions;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Category {
        ELECTRONICS("Electronics"),
        ID_CARDS("ID Cards"),
        WALLETS_MONEY("Wallets & Money"),
        BOOKS_NOTES("Books & Notes"),
        BAGS("Bags"),
        CLOTHING("Clothing"),
        ACCESSORIES("Accessories"),
        KEYS("Keys"),
        DOCUMENTS("Documents"),
        OTHER("Other");

        private final String displayName;

        Category(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum ItemType {
        LOST, FOUND
    }

    public enum ItemStatus {
        ACTIVE, CLAIMED, RETURNED, CLOSED
    }
}
