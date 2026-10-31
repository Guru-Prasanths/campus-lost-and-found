package com.campuslostfound.controller;

import com.campuslostfound.model.Claim;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.UserRepository;
import com.campuslostfound.service.ClaimService;
import com.campuslostfound.service.ItemService;
import com.campuslostfound.service.NotificationService;
import com.campuslostfound.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final ItemService itemService;
    private final ClaimService claimService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @GetMapping
    public String adminDashboard(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        User admin = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        model.addAttribute("currentUser", admin);
        model.addAttribute("unreadNotifications", notificationService.getUnreadCount(admin));

        // Stats
        model.addAttribute("totalUsers", userService.getTotalUsers());
        model.addAttribute("totalItems", itemService.getTotalItems());
        model.addAttribute("activeItems", itemService.getActiveItemsCount());
        model.addAttribute("returnedItems", itemService.getReturnedItemsCount());
        model.addAttribute("pendingClaims", claimService.getPendingClaimsCount());
        model.addAttribute("approvedClaims", claimService.getApprovedClaimsCount());
        model.addAttribute("totalClaims", claimService.getTotalClaims());
        model.addAttribute("studentCount", userService.countByRole(User.UserRole.STUDENT));
        model.addAttribute("staffCount", userService.countByRole(User.UserRole.STAFF));

        // Recent data
        List<Item> recentItems = itemService.findRecentItems(5);
        model.addAttribute("recentItems", recentItems);

        Page<Claim> pendingClaimsPage = claimService.findClaimsByStatus(Claim.ClaimStatus.PENDING, 0, 5);
        model.addAttribute("pendingClaimsList", pendingClaimsPage.getContent());

        return "admin/dashboard";
    }

    @GetMapping("/users")
    public String manageUsers(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        User admin = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        model.addAttribute("currentUser", admin);
        model.addAttribute("unreadNotifications", notificationService.getUnreadCount(admin));

        List<User> users = userService.findAllUsers();
        model.addAttribute("users", users);
        return "admin/users";
    }

    @PostMapping("/users/{id}/toggle")
    public String toggleUserStatus(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        userService.toggleUserStatus(id);
        redirectAttributes.addFlashAttribute("successMessage", "User status updated successfully.");
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        userService.deleteUser(id);
        redirectAttributes.addFlashAttribute("successMessage", "User deleted successfully.");
        return "redirect:/admin/users";
    }

    @GetMapping("/items")
    public String manageItems(@RequestParam(defaultValue = "0") int page,
                               Model model, @AuthenticationPrincipal UserDetails userDetails) {
        User admin = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        model.addAttribute("currentUser", admin);
        model.addAttribute("unreadNotifications", notificationService.getUnreadCount(admin));

        Page<Item> itemsPage = itemService.findActiveItems(page, 15, "newest");
        model.addAttribute("items", itemsPage);
        return "admin/items";
    }

    @PostMapping("/items/{id}/status")
    public String updateItemStatus(@PathVariable Long id,
                                    @RequestParam Item.ItemStatus status,
                                    RedirectAttributes redirectAttributes) {
        itemService.updateItemStatus(id, status);
        redirectAttributes.addFlashAttribute("successMessage", "Item status updated to " + status);
        return "redirect:/admin/items";
    }

    @PostMapping("/items/{id}/delete")
    public String deleteItem(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        itemService.deleteItem(id);
        redirectAttributes.addFlashAttribute("successMessage", "Item deleted successfully.");
        return "redirect:/admin/items";
    }

    @GetMapping("/claims")
    public String manageClaims(@RequestParam(defaultValue = "0") int page,
                                @RequestParam(required = false) Claim.ClaimStatus status,
                                Model model, @AuthenticationPrincipal UserDetails userDetails) {
        User admin = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        model.addAttribute("currentUser", admin);
        model.addAttribute("unreadNotifications", notificationService.getUnreadCount(admin));

        Page<Claim> claimsPage;
        if (status != null) {
            claimsPage = claimService.findClaimsByStatus(status, page, 15);
        } else {
            claimsPage = claimService.findAllClaims(page, 15);
        }
        model.addAttribute("claims", claimsPage);
        model.addAttribute("selectedStatus", status);
        model.addAttribute("claimStatuses", Claim.ClaimStatus.values());
        return "admin/claims";
    }

    @PostMapping("/claims/{id}/approve")
    public String approveClaim(@PathVariable Long id,
                                @RequestParam(required = false) String notes,
                                RedirectAttributes redirectAttributes) {
        claimService.updateClaimStatus(id, Claim.ClaimStatus.APPROVED, notes);
        redirectAttributes.addFlashAttribute("successMessage", "Claim #" + id + " approved successfully.");
        return "redirect:/admin/claims";
    }

    @PostMapping("/claims/{id}/reject")
    public String rejectClaim(@PathVariable Long id,
                               @RequestParam(required = false) String notes,
                               RedirectAttributes redirectAttributes) {
        claimService.updateClaimStatus(id, Claim.ClaimStatus.REJECTED, notes);
        redirectAttributes.addFlashAttribute("successMessage", "Claim #" + id + " rejected.");
        return "redirect:/admin/claims";
    }

    @PostMapping("/claims/{id}/review")
    public String markUnderReview(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        claimService.updateClaimStatus(id, Claim.ClaimStatus.UNDER_REVIEW, "Under admin review");
        redirectAttributes.addFlashAttribute("successMessage", "Claim #" + id + " marked as under review.");
        return "redirect:/admin/claims";
    }
}

