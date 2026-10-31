package com.campuslostfound.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quiz_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private Item item;

    @Column(nullable = false, length = 500)
    private String questionText;

    @Column(nullable = false, length = 250)
    private String optionA;

    @Column(nullable = false, length = 250)
    private String optionB;

    @Column(nullable = false, length = 250)
    private String optionC;

    @Column(nullable = false, length = 250)
    private String optionD;

    @Column(nullable = false, length = 1)
    private String correctOption; // 'A', 'B', 'C', or 'D'

    @Column(length = 500)
    private String explanation;
}
