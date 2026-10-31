package com.campuslostfound.service;

import com.campuslostfound.model.Notification;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification createNotification(User user, String title, String message, String link) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .link(link)
                .read(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndReadFalseOrderByCreatedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserAndReadFalseOrderByCreatedAtDesc(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}

