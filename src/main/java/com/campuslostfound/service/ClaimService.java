package com.campuslostfound.service;

import com.campuslostfound.dto.ClaimDto;
import com.campuslostfound.model.Claim;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.ClaimRepository;
import com.campuslostfound.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final NotificationService notificationService;

    public Claim submitClaim(ClaimDto dto, User claimant) {
        Item item = itemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (claimRepository.existsByItemAndClaimant(item, claimant)) {
            throw new RuntimeException("You have already submitted a claim for this item");
        }

        if (item.getReportedBy().getId().equals(claimant.getId())) {
            throw new RuntimeException("You cannot claim your own reported item");
        }

        if (item.getStatus() != Item.ItemStatus.ACTIVE) {
            throw new RuntimeException("This item is no longer available for claims");
        }

        Claim claim = Claim.builder()
                .item(item)
                .claimant(claimant)
                .proofOfOwnership(dto.getProofOfOwnership())
                .additionalInfo(dto.getAdditionalInfo())
                .verificationQuestionAnswer(dto.getVerificationQuestionAnswer())
                .status(Claim.ClaimStatus.PENDING)
                .build();

        Claim savedClaim = claimRepository.save(claim);

        // Notify the item reporter
        notificationService.createNotification(
                item.getReportedBy(),
                "New Claim Received",
                "A new claim has been submitted for your item: " + item.getItemName(),
                "/items/" + item.getId()
        );

        return savedClaim;
    }

    @Transactional(readOnly = true)
    public Optional<Claim> findById(Long id) {
        return claimRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Claim> findUserClaims(User user) {
        return claimRepository.findByClaimantOrderByCreatedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public List<Claim> findItemClaims(Item item) {
        return claimRepository.findByItemOrderByCreatedAtDesc(item);
    }

    @Transactional(readOnly = true)
    public Page<Claim> findAllClaims(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return claimRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Claim> findClaimsByStatus(Claim.ClaimStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return claimRepository.findByStatus(status, pageable);
    }

    public Claim updateClaimStatus(Long claimId, Claim.ClaimStatus newStatus, String adminNotes) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found: " + claimId));

        claim.setStatus(newStatus);
        claim.setAdminNotes(adminNotes);
        claim.setResolvedAt(LocalDateTime.now());

        if (newStatus == Claim.ClaimStatus.APPROVED) {
            claim.getItem().setStatus(Item.ItemStatus.CLAIMED);
            itemRepository.save(claim.getItem());

            notificationService.createNotification(
                    claim.getClaimant(),
                    "Claim Approved!",
                    "Your claim for '" + claim.getItem().getItemName() + "' has been approved. Please visit the admin office to collect your item.",
                    "/claims/" + claimId
            );
        } else if (newStatus == Claim.ClaimStatus.REJECTED) {
            notificationService.createNotification(
                    claim.getClaimant(),
                    "Claim Rejected",
                    "Your claim for '" + claim.getItem().getItemName() + "' has been rejected. " +
                            (adminNotes != null ? "Reason: " + adminNotes : ""),
                    "/claims/" + claimId
            );
        }

        return claimRepository.save(claim);
    }

    @Transactional(readOnly = true)
    public long getTotalClaims() {
        return claimRepository.count();
    }

    @Transactional(readOnly = true)
    public long getPendingClaimsCount() {
        return claimRepository.countByStatus(Claim.ClaimStatus.PENDING);
    }

    @Transactional(readOnly = true)
    public long getApprovedClaimsCount() {
        return claimRepository.countByStatus(Claim.ClaimStatus.APPROVED);
    }

    @Transactional(readOnly = true)
    public boolean hasUserClaimedItem(Item item, User user) {
        return claimRepository.existsByItemAndClaimant(item, user);
    }
}

