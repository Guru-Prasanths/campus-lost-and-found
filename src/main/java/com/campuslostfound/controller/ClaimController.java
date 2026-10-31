package com.campuslostfound.controller;

import com.campuslostfound.dto.ClaimDto;
import com.campuslostfound.model.Claim;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.UserRepository;
import com.campuslostfound.service.ClaimService;
import com.campuslostfound.service.ItemService;
import com.campuslostfound.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;
    private final ItemService itemService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final com.campuslostfound.service.QuizService quizService;

    @GetMapping
    public String myClaims(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Claim> claims = claimService.findUserClaims(user);
        model.addAttribute("claims", claims);
        model.addAttribute("currentUser", user);
        model.addAttribute("unreadNotifications", notificationService.getUnreadCount(user));

        return "claims/my-claims";
    }

    @GetMapping("/{id:[0-9]+}")
    public String claimDetail(@PathVariable Long id,
                               @AuthenticationPrincipal UserDetails userDetails,
                               Model model) {
        Claim claim = claimService.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only the claimant, item reporter, or admin can view the claim
        boolean isClaimant = claim.getClaimant().getId().equals(user.getId());
        boolean isItemOwner = claim.getItem().getReportedBy().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.UserRole.ADMIN;

        if (!isClaimant && !isItemOwner && !isAdmin) {
            return "redirect:/claims";
        }

        model.addAttribute("claim", claim);
        model.addAttribute("currentUser", user);
        model.addAttribute("isAdmin", isAdmin);
        model.addAttribute("isItemOwner", isItemOwner);
        model.addAttribute("unreadNotifications", notificationService.getUnreadCount(user));

        return "claims/detail";
    }

    @PostMapping({"", "/submit"})
    public String submitClaim(@Valid @ModelAttribute("claimDto") ClaimDto dto,
                               BindingResult result,
                               @AuthenticationPrincipal UserDetails userDetails,
                               jakarta.servlet.http.HttpSession session,
                               RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "Please provide detailed proof of ownership.");
            return "redirect:/items/" + dto.getItemId();
        }

        Item item = itemService.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (item.getItemType() == Item.ItemType.FOUND && !quizService.isItemVerifiedInSession(session, item.getId())) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "Ownership verification required: You must complete and pass the verification quiz before submitting a claim for this found item.");
            return "redirect:/items/" + dto.getItemId();
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            Claim claim = claimService.submitClaim(dto, user);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Your claim has been submitted successfully! Claim ID: #" + claim.getId() +
                    ". We will review your claim and notify you.");
            return "redirect:/claims/" + claim.getId();
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/items/" + dto.getItemId();
        }
    }

    @PostMapping("/{id}/withdraw")
    public String withdrawClaim(@PathVariable Long id,
                                 @AuthenticationPrincipal UserDetails userDetails,
                                 RedirectAttributes redirectAttributes) {
        Claim claim = claimService.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!claim.getClaimant().getId().equals(user.getId())) {
            redirectAttributes.addFlashAttribute("errorMessage", "Access denied");
            return "redirect:/claims";
        }

        claimService.updateClaimStatus(id, Claim.ClaimStatus.REJECTED, "Withdrawn by claimant");
        redirectAttributes.addFlashAttribute("successMessage", "Claim withdrawn successfully.");
        return "redirect:/claims";
    }
}

