package com.campuslostfound.controller;

import com.campuslostfound.model.Claim;
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
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ItemService itemService;
    private final ClaimService claimService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public String dashboard(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        model.addAttribute("currentUser", currentUser);

        // User's items
        List<Item> lostItems = itemService.findUserItemsByType(currentUser, Item.ItemType.LOST);
        List<Item> foundItems = itemService.findUserItemsByType(currentUser, Item.ItemType.FOUND);
        model.addAttribute("lostItems", lostItems);
        model.addAttribute("foundItems", foundItems);

        // User's claims
        List<Claim> allClaims = claimService.findUserClaims(currentUser);
        List<Claim> pendingClaims = allClaims.stream()
                .filter(c -> c.getStatus() == Claim.ClaimStatus.PENDING).toList();
        List<Claim> approvedClaims = allClaims.stream()
                .filter(c -> c.getStatus() == Claim.ClaimStatus.APPROVED).toList();

        model.addAttribute("allClaims", allClaims);
        model.addAttribute("pendingClaims", pendingClaims);
        model.addAttribute("approvedClaims", approvedClaims);

        // Notifications
        List<com.campuslostfound.model.Notification> notifications =
                notificationService.getUserNotifications(currentUser);
        model.addAttribute("notifications", notifications);
        model.addAttribute("unreadNotifications", notificationService.getUnreadCount(currentUser));

        // Stats
        model.addAttribute("totalLostReported", lostItems.size());
        model.addAttribute("totalFoundReported", foundItems.size());
        model.addAttribute("totalClaimsSubmitted", allClaims.size());
        model.addAttribute("totalApprovedClaims", approvedClaims.size());

        return "user/dashboard";
    }
}

