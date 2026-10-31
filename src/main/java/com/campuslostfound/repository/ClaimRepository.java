package com.campuslostfound.repository;

import com.campuslostfound.model.Claim;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByClaimantOrderByCreatedAtDesc(User claimant);
    List<Claim> findByItemOrderByCreatedAtDesc(Item item);
    boolean existsByItemAndClaimant(Item item, User claimant);
    long countByStatus(Claim.ClaimStatus status);
    Optional<Claim> findByItemAndClaimant(Item item, User claimant);
    Page<Claim> findByStatus(Claim.ClaimStatus status, Pageable pageable);
    List<Claim> findByClaimantAndStatusOrderByCreatedAtDesc(User claimant, Claim.ClaimStatus status);
}
