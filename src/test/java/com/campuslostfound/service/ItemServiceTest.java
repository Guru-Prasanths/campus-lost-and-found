package com.campuslostfound.service;

import com.campuslostfound.dto.ItemDto;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemService itemService;

    private User reporter;
    private ItemDto itemDto;

    @BeforeEach
    void setUp() {
        reporter = User.builder()
                .id(1L)
                .fullName("John Doe")
                .collegeId("CS1001")
                .email("john@campus.edu")
                .build();

        itemDto = ItemDto.builder()
                .itemName("HP Laptop Charger")
                .category(Item.Category.ELECTRONICS)
                .description("Black 65W charger with round barrel pin left in lab 3")
                .location("Computer Lab 3")
                .date(LocalDate.now())
                .approximateTime(LocalTime.of(14, 0))
                .itemType(Item.ItemType.LOST)
                .privateDetails("Serial ending in 9811")
                .build();
    }

    @Test
    @DisplayName("Should successfully report a lost item without photograph")
    void reportItem_Success() throws IOException {
        Item savedItem = Item.builder()
                .id(100L)
                .itemName(itemDto.getItemName())
                .category(itemDto.getCategory())
                .description(itemDto.getDescription())
                .location(itemDto.getLocation())
                .date(itemDto.getDate())
                .itemType(Item.ItemType.LOST)
                .status(Item.ItemStatus.ACTIVE)
                .reportedBy(reporter)
                .build();

        when(itemRepository.save(any(Item.class))).thenReturn(savedItem);

        Item result = itemService.reportItem(itemDto, reporter);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals("HP Laptop Charger", result.getItemName());
        assertEquals(Item.ItemStatus.ACTIVE, result.getStatus());
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    @DisplayName("Should find active items with filters")
    void findItemsWithFilters_Success() {
        Item item = Item.builder().id(1L).itemName("Blue Backpack").build();
        Page<Item> page = new PageImpl<>(List.of(item));

        when(itemRepository.findWithFilters(
                eq("Backpack"), eq(Item.Category.BAGS), eq(Item.ItemType.LOST),
                eq("Library"), any(), any(), any(Pageable.class)
        )).thenReturn(page);

        Page<Item> result = itemService.findItemsWithFilters(
                "Backpack", Item.Category.BAGS, Item.ItemType.LOST,
                "Library", null, null, 0, 10, "newest");

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Blue Backpack", result.getContent().get(0).getItemName());
    }

    @Test
    @DisplayName("Should update item status to RETURNED")
    void updateItemStatus_Success() {
        Item item = Item.builder().id(50L).status(Item.ItemStatus.ACTIVE).build();
        when(itemRepository.findById(50L)).thenReturn(Optional.of(item));
        when(itemRepository.save(any(Item.class))).thenAnswer(i -> i.getArgument(0));

        Item updated = itemService.updateItemStatus(50L, Item.ItemStatus.RETURNED);

        assertEquals(Item.ItemStatus.RETURNED, updated.getStatus());
        verify(itemRepository, times(1)).save(item);
    }
}

