package com.campuslostfound.repository;

import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    Page<Item> findByStatus(Item.ItemStatus status, Pageable pageable);

    Page<Item> findByItemTypeAndStatus(Item.ItemType itemType, Item.ItemStatus status, Pageable pageable);

    Page<Item> findByCategoryAndStatus(Item.Category category, Item.ItemStatus status, Pageable pageable);

    List<Item> findByReportedByOrderByCreatedAtDesc(User user);

    List<Item> findByReportedByAndItemTypeOrderByCreatedAtDesc(User user, Item.ItemType itemType);

    @Query("SELECT i FROM Item i WHERE i.status = 'ACTIVE' AND " +
           "(LOWER(i.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Item> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT i FROM Item i WHERE i.status = 'ACTIVE' AND " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(i.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:itemType IS NULL OR i.itemType = :itemType) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(i.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:dateFrom IS NULL OR i.date >= :dateFrom) AND " +
           "(:dateTo IS NULL OR i.date <= :dateTo)")
    Page<Item> findWithFilters(
            @Param("keyword") String keyword,
            @Param("category") Item.Category category,
            @Param("itemType") Item.ItemType itemType,
            @Param("location") String location,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            Pageable pageable);

    long countByStatus(Item.ItemStatus status);
    long countByItemType(Item.ItemType itemType);

    @Query("SELECT i FROM Item i WHERE i.status = 'ACTIVE' ORDER BY i.createdAt DESC")
    List<Item> findRecentItems(Pageable pageable);

    long countByItemTypeAndStatus(Item.ItemType itemType, Item.ItemStatus status);
}
