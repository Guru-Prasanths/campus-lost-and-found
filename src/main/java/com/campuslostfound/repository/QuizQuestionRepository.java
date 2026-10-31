package com.campuslostfound.repository;

import com.campuslostfound.model.Item;
import com.campuslostfound.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByItemOrderByIdAsc(Item item);
    List<QuizQuestion> findByItemIdOrderByIdAsc(Long itemId);
    void deleteByItem(Item item);
}

