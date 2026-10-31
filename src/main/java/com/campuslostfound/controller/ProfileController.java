package com.campuslostfound.controller;

import com.campuslostfound.model.User;
import com.campuslostfound.repository.UserRepository;
import com.campuslostfound.service.NotificationService;
import com.campuslostfound.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @GetMapping
    public String profile(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("unreadNotifications", notificationService.getUnreadCount(currentUser));
        return "user/profile";
    }

    @PostMapping("/update")
    public String updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                 @RequestParam String fullName,
                                 @RequestParam(required = false) String phone,
                                 @RequestParam(required = false) String department,
                                 @RequestParam(required = false) String yearOfStudy,
                                 RedirectAttributes redirectAttributes) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(fullName);
        user.setPhone(phone);
        user.setDepartment(department);
        user.setYearOfStudy(yearOfStudy);
        userService.updateUser(user);

        redirectAttributes.addFlashAttribute("successMessage", "Profile updated successfully!");
        return "redirect:/profile";
    }

    @PostMapping("/change-password")
    public String changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                  @RequestParam String currentPassword,
                                  @RequestParam String newPassword,
                                  @RequestParam String confirmPassword,
                                  RedirectAttributes redirectAttributes) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!newPassword.equals(confirmPassword)) {
            redirectAttributes.addFlashAttribute("errorMessage", "New passwords do not match.");
            return "redirect:/profile";
        }
        if (newPassword.length() < 8) {
            redirectAttributes.addFlashAttribute("errorMessage", "Password must be at least 8 characters.");
            return "redirect:/profile";
        }

        userService.updatePassword(user, newPassword);
        redirectAttributes.addFlashAttribute("successMessage", "Password changed successfully!");
        return "redirect:/profile";
    }
}

