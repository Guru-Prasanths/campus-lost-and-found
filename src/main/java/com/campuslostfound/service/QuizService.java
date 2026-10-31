package com.campuslostfound.service;

import com.campuslostfound.dto.QuizQuestionDto;
import com.campuslostfound.dto.QuizResultDto;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.QuizQuestion;
import com.campuslostfound.repository.QuizQuestionRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class QuizService {

    private final QuizQuestionRepository quizQuestionRepository;
    private static final String QUIZ_VERIFIED_PREFIX = "QUIZ_VERIFIED_ITEM_";

    @Transactional(readOnly = true)
    public List<QuizQuestion> getQuestionsForItem(Item item) {
        List<QuizQuestion> questions = quizQuestionRepository.findByItemOrderByIdAsc(item);
        if (questions.isEmpty()) {
            questions = generateDynamicQuestions(item);
        }
        return questions;
    }

    @Transactional(readOnly = true)
    public List<QuizQuestionDto> getQuizDtoForItem(Item item) {
        return getQuestionsForItem(item).stream()
                .map(q -> QuizQuestionDto.builder()
                        .id(q.getId() != null ? q.getId() : (long) q.getQuestionText().hashCode())
                        .questionText(q.getQuestionText())
                        .optionA(q.getOptionA())
                        .optionB(q.getOptionB())
                        .optionC(q.getOptionC())
                        .optionD(q.getOptionD())
                        .build())
                .toList();
    }

    public QuizResultDto evaluateQuiz(Item item, Map<String, String> answers, HttpSession session) {
        List<QuizQuestion> questions = getQuestionsForItem(item);
        if (questions.isEmpty()) {
            return QuizResultDto.builder()
                    .score(0)
                    .totalQuestions(0)
                    .percentage(100)
                    .passed(true)
                    .feedbackMessage("No verification quiz required for this item.")
                    .build();
        }

        int score = 0;
        int total = questions.size();
        Map<Long, Boolean> results = new HashMap<>();

        for (QuizQuestion q : questions) {
            String qKey = "q_" + (q.getId() != null ? q.getId() : q.getQuestionText().hashCode());
            String userAnswer = answers.get(qKey);
            if (userAnswer == null) {
                userAnswer = answers.get(String.valueOf(q.getId()));
            }

            boolean isCorrect = userAnswer != null && userAnswer.trim().equalsIgnoreCase(q.getCorrectOption().trim());
            if (isCorrect) {
                score++;
            }
            results.put(q.getId() != null ? q.getId() : (long) q.getQuestionText().hashCode(), isCorrect);
        }

        int percentage = (int) Math.round(((double) score / total) * 100);
        // Requirement: Must score at least 75% to prove ownership familiarity
        boolean passed = percentage >= 75;

        String feedback;
        if (passed) {
            feedback = String.format("Verification Successful! You scored %d/%d (%d%%). You have proved familiarity with this item's details. You can now submit your ownership claim.",
                    score, total, percentage);
            markItemVerifiedInSession(session, item.getId());
        } else {
            feedback = String.format("Verification Failed. You scored %d/%d (%d%%). The answers provided do not match the documented physical characteristics of this found item. Minimum passing score is 75%%.",
                    score, total, percentage);
        }

        return QuizResultDto.builder()
                .score(score)
                .totalQuestions(total)
                .percentage(percentage)
                .passed(passed)
                .feedbackMessage(feedback)
                .questionResults(results)
                .build();
    }

    public boolean isItemVerifiedInSession(HttpSession session, Long itemId) {
        if (session == null || itemId == null) return false;
        Object val = session.getAttribute(QUIZ_VERIFIED_PREFIX + itemId);
        return Boolean.TRUE.equals(val);
    }

    public void markItemVerifiedInSession(HttpSession session, Long itemId) {
        if (session != null && itemId != null) {
            session.setAttribute(QUIZ_VERIFIED_PREFIX + itemId, Boolean.TRUE);
        }
    }

    public void createQuestion(Item item, String questionText,
                               String optionA, String optionB, String optionC, String optionD,
                               String correctOption, String explanation) {
        QuizQuestion q = QuizQuestion.builder()
                .item(item)
                .questionText(questionText)
                .optionA(optionA)
                .optionB(optionB)
                .optionC(optionC)
                .optionD(optionD)
                .correctOption(correctOption)
                .explanation(explanation)
                .build();
        quizQuestionRepository.save(q);
    }

    private List<QuizQuestion> generateDynamicQuestions(Item item) {
        List<QuizQuestion> list = new ArrayList<>();

        // Question 1: Location where found
        list.add(QuizQuestion.builder()
                .item(item)
                .questionText("In which campus location was this " + item.getItemName() + " discovered?")
                .optionA(item.getLocation())
                .optionB("Main Auditorium Balcony")
                .optionC("Cafeteria Snack Counter")
                .optionD("Sports Ground Pavilion")
                .correctOption("A")
                .explanation("Discovered at " + item.getLocation())
                .build());

        // Question 2: Category
        list.add(QuizQuestion.builder()
                .item(item)
                .questionText("What general category does this item fall under?")
                .optionA("Keys & Lockers")
                .optionB(item.getCategory().getDisplayName())
                .optionC("Documents & Forms")
                .optionD("Clothing & Apparel")
                .correctOption("B")
                .explanation("Category is " + item.getCategory().getDisplayName())
                .build());

        // Question 3: Distinguishing characteristic
        String descSnippet = item.getDescription().length() > 60 ? item.getDescription().substring(0, 60) + "..." : item.getDescription();
        list.add(QuizQuestion.builder()
                .item(item)
                .questionText("Which of the following descriptions accurately matches this item?")
                .optionA("Bright neon orange with university sports logo")
                .optionB(descSnippet)
                .optionC("Brand-new sealed box with barcode intact")
                .optionD("Heavily worn with broken strap/zipper")
                .correctOption("B")
                .explanation(descSnippet)
                .build());

        return list;
    }
}
