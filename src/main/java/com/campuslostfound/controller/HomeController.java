package com.campuslostfound.controller;

import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.UserRepository;
import com.campuslostfound.service.ClaimService;
import com.campuslostfound.service.ItemService;
import com.campuslostfound.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final ItemService itemService;
    private final ClaimService claimService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @GetMapping({"/", "/home", "/index"})
    public String home(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        // Stats
        model.addAttribute("totalItems", itemService.getTotalItems());
        model.addAttribute("recoveredItems", itemService.getReturnedItemsCount());
        model.addAttribute("activeListings", itemService.getActiveItemsCount());
        model.addAttribute("pendingClaims", claimService.getPendingClaimsCount());
        model.addAttribute("totalUsers", userRepository.count());

        // Recent items
        List<Item> recentItems = itemService.findRecentItems(6);
        model.addAttribute("recentItems", recentItems);

        // If user logged in, pass notification count
        if (userDetails != null) {
            userRepository.findByEmail(userDetails.getUsername()).ifPresent(user -> {
                model.addAttribute("currentUser", user);
                model.addAttribute("unreadNotifications", notificationService.getUnreadCount(user));
            });
        }

        return "index";
    }

    @GetMapping("/error/403")
    public String accessDenied() {
        return "error/403";
    }
}

