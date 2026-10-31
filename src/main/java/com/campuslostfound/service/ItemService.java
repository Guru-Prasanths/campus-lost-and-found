package com.campuslostfound.service;

import com.campuslostfound.dto.ItemDto;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;

    @Value("${app.upload.dir:uploads/items}")
    private String uploadDir;

    public Item reportItem(ItemDto dto, User reportedBy) throws IOException {
        String imagePath = null;
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            imagePath = saveImage(dto.getImage());
        }

        Item item = Item.builder()
                .itemName(dto.getItemName())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .date(dto.getDate())
                .approximateTime(dto.getApproximateTime())
                .imagePath(imagePath)
                .privateDetails(dto.getPrivateDetails())
                .itemType(dto.getItemType())
                .status(Item.ItemStatus.ACTIVE)
                .reportedBy(reportedBy)
                .build();

        return itemRepository.save(item);
    }

    private String saveImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return fileName;
    }

    @Transactional(readOnly = true)
    public Optional<Item> findById(Long id) {
        return itemRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Page<Item> findActiveItems(int page, int size, String sort) {
        Sort sortObj = "oldest".equals(sort) ? Sort.by("createdAt").ascending() : Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page, size, sortObj);
        return itemRepository.findByStatus(Item.ItemStatus.ACTIVE, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Item> findItemsWithFilters(String keyword, Item.Category category, Item.ItemType itemType,
                                            String location, LocalDate dateFrom, LocalDate dateTo,
                                            int page, int size, String sort) {
        Sort sortObj = "oldest".equals(sort) ? Sort.by("createdAt").ascending() : Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page, size, sortObj);
        return itemRepository.findWithFilters(keyword, category, itemType, location, dateFrom, dateTo, pageable);
    }

    @Transactional(readOnly = true)
    public List<Item> findUserItems(User user) {
        return itemRepository.findByReportedByOrderByCreatedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public List<Item> findUserItemsByType(User user, Item.ItemType type) {
        return itemRepository.findByReportedByAndItemTypeOrderByCreatedAtDesc(user, type);
    }

    @Transactional(readOnly = true)
    public List<Item> findRecentItems(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return itemRepository.findRecentItems(pageable);
    }

    public Item updateItemStatus(Long itemId, Item.ItemStatus status) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));
        item.setStatus(status);
        return itemRepository.save(item);
    }

    public Item updateItem(Long itemId, ItemDto dto) throws IOException {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        item.setItemName(dto.getItemName());
        item.setCategory(dto.getCategory());
        item.setDescription(dto.getDescription());
        item.setLocation(dto.getLocation());
        item.setDate(dto.getDate());
        item.setApproximateTime(dto.getApproximateTime());
        item.setPrivateDetails(dto.getPrivateDetails());

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String imagePath = saveImage(dto.getImage());
            item.setImagePath(imagePath);
        }

        return itemRepository.save(item);
    }

    public void deleteItem(Long itemId) {
        itemRepository.deleteById(itemId);
    }

    @Transactional(readOnly = true)
    public long getTotalItems() {
        return itemRepository.count();
    }

    @Transactional(readOnly = true)
    public long getActiveItemsCount() {
        return itemRepository.countByStatus(Item.ItemStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public long getReturnedItemsCount() {
        return itemRepository.countByStatus(Item.ItemStatus.RETURNED);
    }

    @Transactional(readOnly = true)
    public long getLostItemsCount() {
        return itemRepository.countByItemType(Item.ItemType.LOST);
    }

    @Transactional(readOnly = true)
    public long getFoundItemsCount() {
        return itemRepository.countByItemType(Item.ItemType.FOUND);
    }
}

