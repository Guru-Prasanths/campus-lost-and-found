package com.campuslostfound.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResultDto {
    private int score;
    private int totalQuestions;
    private int percentage;
    private boolean passed;
    private String feedbackMessage;
    private Map<Long, Boolean> questionResults;
}
