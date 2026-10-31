package com.campuslostfound.service;

import com.campuslostfound.dto.QuizQuestionDto;
import com.campuslostfound.dto.QuizResultDto;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.QuizQuestion;
import com.campuslostfound.repository.QuizQuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class QuizServiceTest {

    @Mock
    private QuizQuestionRepository quizQuestionRepository;

    @InjectMocks
    private QuizService quizService;

    private Item foundItem;
    private QuizQuestion q1;
    private QuizQuestion q2;
    private QuizQuestion q3;
    private QuizQuestion q4;

    @BeforeEach
    void setUp() {
        foundItem = Item.builder()
                .id(100L)
                .itemName("Found: Apple MacBook Air M1")
                .category(Item.Category.ELECTRONICS)
                .description("Silver MacBook Air with transparent shell.")
                .location("Central Digital Library Terminal 7")
                .itemType(Item.ItemType.FOUND)
                .status(Item.ItemStatus.ACTIVE)
                .build();

        q1 = QuizQuestion.builder()
                .id(1L)
                .item(foundItem)
                .questionText("What is the exterior color?")
                .optionA("Space Grey")
                .optionB("Silver")
                .optionC("Gold")
                .optionD("Midnight")
                .correctOption("B")
                .build();

        q2 = QuizQuestion.builder()
                .id(2L)
                .item(foundItem)
                .questionText("Where was it found?")
                .optionA("Central Digital Library Terminal 7")
                .optionB("Canteen")
                .optionC("Auditorium")
                .optionD("Hostel")
                .correctOption("A")
                .build();

        q3 = QuizQuestion.builder()
                .id(3L)
                .item(foundItem)
                .questionText("Which chip?")
                .optionA("Intel i5")
                .optionB("Apple M1")
                .optionC("AMD Ryzen")
                .optionD("Apple M3")
                .correctOption("B")
                .build();

        q4 = QuizQuestion.builder()
                .id(4L)
                .item(foundItem)
                .questionText("What case is on the laptop?")
                .optionA("Black leather")
                .optionB("Clear transparent snap-on shell")
                .optionC("Red carbon wrap")
                .optionD("None")
                .correctOption("B")
                .build();
    }

    @Test
    @DisplayName("Should retrieve quiz question DTOs successfully")
    void testGetQuizDto() {
        when(quizQuestionRepository.findByItemOrderByIdAsc(foundItem)).thenReturn(List.of(q1, q2, q3, q4));

        List<QuizQuestionDto> dtos = quizService.getQuizDtoForItem(foundItem);

        assertEquals(4, dtos.size());
        assertEquals("What is the exterior color?", dtos.get(0).getQuestionText());
    }

    @Test
    @DisplayName("Should pass quiz when score is at least 75%")
    void testEvaluateQuizPassed() {
        when(quizQuestionRepository.findByItemOrderByIdAsc(foundItem)).thenReturn(List.of(q1, q2, q3, q4));
        MockHttpSession session = new MockHttpSession();

        Map<String, String> answers = new HashMap<>();
        answers.put("q_1", "B"); // correct
        answers.put("q_2", "A"); // correct
        answers.put("q_3", "B"); // correct
        answers.put("q_4", "D"); // wrong

        QuizResultDto result = quizService.evaluateQuiz(foundItem, answers, session);

        assertTrue(result.isPassed());
        assertEquals(3, result.getScore());
        assertEquals(4, result.getTotalQuestions());
        assertEquals(75, result.getPercentage());
        assertTrue(quizService.isItemVerifiedInSession(session, foundItem.getId()));
    }

    @Test
    @DisplayName("Should fail quiz when score is below 75%")
    void testEvaluateQuizFailed() {
        when(quizQuestionRepository.findByItemOrderByIdAsc(foundItem)).thenReturn(List.of(q1, q2, q3, q4));
        MockHttpSession session = new MockHttpSession();

        Map<String, String> answers = new HashMap<>();
        answers.put("q_1", "B"); // correct
        answers.put("q_2", "C"); // wrong
        answers.put("q_3", "A"); // wrong
        answers.put("q_4", "D"); // wrong

        QuizResultDto result = quizService.evaluateQuiz(foundItem, answers, session);

        assertFalse(result.isPassed());
        assertEquals(1, result.getScore());
        assertEquals(25, result.getPercentage());
        assertFalse(quizService.isItemVerifiedInSession(session, foundItem.getId()));
    }
}
