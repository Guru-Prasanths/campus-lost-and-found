package com.campuslostfound.dto;

import com.campuslostfound.model.Item;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemDto {

    @NotBlank(message = "Item name is required")
    @Size(max = 150, message = "Item name too long")
    private String itemName;

    @NotNull(message = "Category is required")
    private Item.Category category;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 2000, message = "Description must be 10-2000 characters")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Date is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate date;

    @DateTimeFormat(pattern = "HH:mm")
    private LocalTime approximateTime;

    private MultipartFile image;

    private String privateDetails;

    private Item.ItemType itemType;
}
