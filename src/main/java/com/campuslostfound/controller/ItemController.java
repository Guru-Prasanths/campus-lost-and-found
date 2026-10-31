package com.campuslostfound.controller;

import com.campuslostfound.dto.ClaimDto;
import com.campuslostfound.dto.ItemDto;
import com.campuslostfound.model.Claim;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.UserRepository;
import com.campuslostfound.service.ClaimService;
import com.campuslostfound.service.ItemService;
import com.campuslostfound.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;
    private final ClaimService claimService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @GetMapping
    public String browseItems(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) Item.Category category,
            @RequestParam(required = false) Item.ItemType itemType,
            @RequestParam(defaultValue = "") String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sort,
            Model model,
            @AuthenticationPrincipal UserDetails userDetails) {

        Page<Item> itemsPage = itemService.findItemsWithFilters(
                keyword.isEmpty() ? null : keyword,
                category, itemType,
                location.isEmpty() ? null : location,
                dateFrom, dateTo,
                page, size, sort);

        model.addAttribute("items", itemsPage);
        model.addAttribute("categories", Item.Category.values());
        model.addAttribute("keyword", keyword);
        model.addAttribute("selectedCategory", category);
        model.addAttribute("selectedItemType", itemType);
        model.addAttribute("location", location);
        model.addAttribute("dateFrom", dateFrom);
        model.addAttribute("dateTo", dateTo);
        model.addAttribute("sort", sort);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", itemsPage.getTotalPages());

        if (userDetails != null) {
            userRepository.findByEmail(userDetails.getUsername()).ifPresent(user -> {
                model.addAttribute("currentUser", user);
                model.addAttribute("unreadNotifications", notificationService.getUnreadCount(user));
            });
        }

        return "items/browse";
    }

    @GetMapping("/{id}")
    public String itemDetail(@PathVariable Long id, Model model,
                             @AuthenticationPrincipal UserDetails userDetails) {
        Item item = itemService.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        model.addAttribute("item", item);
        model.addAttribute("claimDto", new ClaimDto());

        List<Claim> itemClaims = claimService.findItemClaims(item);
        model.addAttribute("claims", itemClaims);

        if (userDetails != null) {
            userRepository.findByEmail(userDetails.getUsername()).ifPresent(user -> {
                model.addAttribute("currentUser", user);
                model.addAttribute("hasAlreadyClaimed", claimService.hasUserClaimedItem(item, user));
                model.addAttribute("isOwner", item.getReportedBy().getId().equals(user.getId()));
                model.addAttribute("unreadNotifications", notificationService.getUnreadCount(user));
            });
        }

        return "items/detail";
    }

    @GetMapping("/report/lost")
    public String reportLostForm(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        model.addAttribute("itemDto", new ItemDto());
        model.addAttribute("categories", Item.Category.values());
        model.addAttribute("itemType", "LOST");
        addCurrentUser(model, userDetails);
        return "items/report-lost";
    }

    @PostMapping("/report/lost")
    public String reportLost(@Valid @ModelAttribute("itemDto") ItemDto dto,
                              BindingResult result,
                              @AuthenticationPrincipal UserDetails userDetails,
                              RedirectAttributes redirectAttributes,
                              Model model) throws IOException {
        if (result.hasErrors()) {
            model.addAttribute("categories", Item.Category.values());
            model.addAttribute("itemType", "LOST");
            addCurrentUser(model, userDetails);
            return "items/report-lost";
        }
        dto.setItemType(Item.ItemType.LOST);
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Item item = itemService.reportItem(dto, user);
        redirectAttributes.addFlashAttribute("successMessage",
                "Lost item reported successfully! Item ID: #" + item.getId());
        return "redirect:/items/" + item.getId();
    }

    @GetMapping("/report/found")
    public String reportFoundForm(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        model.addAttribute("itemDto", new ItemDto());
        model.addAttribute("categories", Item.Category.values());
        model.addAttribute("itemType", "FOUND");
        addCurrentUser(model, userDetails);
        return "items/report-found";
    }

    @PostMapping("/report/found")
    public String reportFound(@Valid @ModelAttribute("itemDto") ItemDto dto,
                               BindingResult result,
                               @AuthenticationPrincipal UserDetails userDetails,
                               RedirectAttributes redirectAttributes,
                               Model model) throws IOException {
        if (result.hasErrors()) {
            model.addAttribute("categories", Item.Category.values());
            model.addAttribute("itemType", "FOUND");
            addCurrentUser(model, userDetails);
            return "items/report-found";
        }
        dto.setItemType(Item.ItemType.FOUND);
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Item item = itemService.reportItem(dto, user);
        redirectAttributes.addFlashAttribute("successMessage",
                "Found item reported successfully! Thank you for your honesty. Item ID: #" + item.getId());
        return "redirect:/items/" + item.getId();
    }

    @PostMapping("/{id}/close")
    public String closeItem(@PathVariable Long id,
                             @AuthenticationPrincipal UserDetails userDetails,
                             RedirectAttributes redirectAttributes) {
        Item item = itemService.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!item.getReportedBy().getId().equals(user.getId()) &&
                user.getRole() != User.UserRole.ADMIN) {
            redirectAttributes.addFlashAttribute("errorMessage", "Access denied");
            return "redirect:/items/" + id;
        }

        itemService.updateItemStatus(id, Item.ItemStatus.CLOSED);
        redirectAttributes.addFlashAttribute("successMessage", "Item marked as closed.");
        return "redirect:/dashboard";
    }

    @PostMapping("/{id}/returned")
    public String markReturned(@PathVariable Long id,
                                @AuthenticationPrincipal UserDetails userDetails,
                                RedirectAttributes redirectAttributes) {
        Item item = itemService.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!item.getReportedBy().getId().equals(user.getId()) &&
                user.getRole() != User.UserRole.ADMIN) {
            redirectAttributes.addFlashAttribute("errorMessage", "Access denied");
            return "redirect:/items/" + id;
        }

        itemService.updateItemStatus(id, Item.ItemStatus.RETURNED);
        redirectAttributes.addFlashAttribute("successMessage", "Item marked as returned!");
        return "redirect:/dashboard";
    }

    private void addCurrentUser(Model model, UserDetails userDetails) {
        if (userDetails != null) {
            userRepository.findByEmail(userDetails.getUsername()).ifPresent(user -> {
                model.addAttribute("currentUser", user);
                model.addAttribute("unreadNotifications", notificationService.getUnreadCount(user));
            });
        }
    }
}

