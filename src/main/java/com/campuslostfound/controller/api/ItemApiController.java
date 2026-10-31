package com.campuslostfound.controller.api;

import com.campuslostfound.model.Item;
import com.campuslostfound.service.ClaimService;
import com.campuslostfound.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ItemApiController {

    private final ItemService itemService;
    private final ClaimService claimService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalItems", itemService.getTotalItems());
        stats.put("activeListings", itemService.getActiveItemsCount());
        stats.put("returnedItems", itemService.getReturnedItemsCount());
        stats.put("lostCount", itemService.getLostItemsCount());
        stats.put("foundCount", itemService.getFoundItemsCount());
        stats.put("pendingClaims", claimService.getPendingClaimsCount());
        stats.put("approvedClaims", claimService.getApprovedClaimsCount());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/items")
    public ResponseEntity<Page<Item>> searchItems(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) Item.Category category,
            @RequestParam(required = false) Item.ItemType itemType,
            @RequestParam(defaultValue = "") String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "newest") String sort) {

        Page<Item> items = itemService.findItemsWithFilters(
                keyword.isEmpty() ? null : keyword,
                category, itemType,
                location.isEmpty() ? null : location,
                dateFrom, dateTo,
                page, size, sort);

        return ResponseEntity.ok(items);
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        return itemService.findById(id)
                .map(item -> {
                    // Sanitize private details for public API
                    Item safeItem = Item.builder()
                            .id(item.getId())
                            .itemName(item.getItemName())
                            .category(item.getCategory())
                            .description(item.getDescription())
                            .location(item.getLocation())
                            .date(item.getDate())
                            .approximateTime(item.getApproximateTime())
                            .imagePath(item.getImagePath())
                            .itemType(item.getItemType())
                            .status(item.getStatus())
                            .createdAt(item.getCreatedAt())
                            .build();
                    return ResponseEntity.ok(safeItem);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

