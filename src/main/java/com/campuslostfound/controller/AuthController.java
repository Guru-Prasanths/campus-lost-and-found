package com.campuslostfound.controller;

import com.campuslostfound.dto.UserRegistrationDto;
import com.campuslostfound.model.User;
import com.campuslostfound.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error,
                            @RequestParam(value = "logout", required = false) String logout,
                            @RequestParam(value = "session", required = false) String session,
                            Model model) {
        if (error != null) {
            model.addAttribute("errorMessage", "Invalid email or password. Please try again.");
        }
        if (logout != null) {
            model.addAttribute("successMessage", "You have been logged out successfully.");
        }
        if ("expired".equals(session)) {
            model.addAttribute("errorMessage", "Your session has expired. Please log in again.");
        }
        return "auth/login";
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new UserRegistrationDto());
        model.addAttribute("roles", User.UserRole.values());
        return "auth/register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("user") UserRegistrationDto dto,
                           BindingResult result,
                           RedirectAttributes redirectAttributes,
                           Model model) {
        if (result.hasErrors()) {
            model.addAttribute("roles", User.UserRole.values());
            return "auth/register";
        }

        if (!dto.passwordsMatch()) {
            result.rejectValue("confirmPassword", "error.user", "Passwords do not match");
            model.addAttribute("roles", User.UserRole.values());
            return "auth/register";
        }

        if (userService.emailExists(dto.getEmail())) {
            result.rejectValue("email", "error.user", "This email is already registered");
            model.addAttribute("roles", User.UserRole.values());
            return "auth/register";
        }

        if (userService.collegeIdExists(dto.getCollegeId())) {
            result.rejectValue("collegeId", "error.user", "This College ID is already registered");
            model.addAttribute("roles", User.UserRole.values());
            return "auth/register";
        }

        try {
            userService.registerUser(dto);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Registration successful! Please log in with your credentials.");
            return "redirect:/auth/login";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Registration failed: " + e.getMessage());
            model.addAttribute("roles", User.UserRole.values());
            return "auth/register";
        }
    }
}

