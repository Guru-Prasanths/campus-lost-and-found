package com.campuslostfound.service;

import com.campuslostfound.dto.ClaimDto;
import com.campuslostfound.model.Claim;
import com.campuslostfound.model.Item;
import com.campuslostfound.model.User;
import com.campuslostfound.repository.ClaimRepository;
import com.campuslostfound.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClaimServiceTest {

    @Mock
    private ClaimRepository claimRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ClaimService claimService;

    private User reporter;
    private User claimant;
    private Item foundItem;
    private ClaimDto claimDto;

    @BeforeEach
    void setUp() {
        reporter = User.builder().id(1L).fullName("Reporter User").email("reporter@campus.edu").build();
        claimant = User.builder().id(2L).fullName("Claimant User").email("claimant@campus.edu").build();

        foundItem = Item.builder()
                .id(10L)
                .itemName("Found Key Bunch")
                .category(Item.Category.KEYS)
                .status(Item.ItemStatus.ACTIVE)
                .reportedBy(reporter)
                .build();

        claimDto = ClaimDto.builder()
                .itemId(10L)
                .proofOfOwnership("It has 3 Godrej keys and a red Spider-Man keychain.")
                .additionalInfo("Lost near the badminton court.")
                .build();
    }

    @Test
    @DisplayName("Should successfully submit an ownership claim")
    void submitClaim_Success() {
        when(itemRepository.findById(10L)).thenReturn(Optional.of(foundItem));
        when(claimRepository.existsByItemAndClaimant(foundItem, claimant)).thenReturn(false);

        Claim savedClaim = Claim.builder()
                .id(101L)
                .item(foundItem)
                .claimant(claimant)
                .proofOfOwnership(claimDto.getProofOfOwnership())
                .status(Claim.ClaimStatus.PENDING)
                .build();

        when(claimRepository.save(any(Claim.class))).thenReturn(savedClaim);

        Claim result = claimService.submitClaim(claimDto, claimant);

        assertNotNull(result);
        assertEquals(Claim.ClaimStatus.PENDING, result.getStatus());
        verify(notificationService, times(1)).createNotification(eq(reporter), anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Should prevent user from claiming their own reported item")
    void submitClaim_SelfClaim_ThrowsException() {
        when(itemRepository.findById(10L)).thenReturn(Optional.of(foundItem));
        // Claimant is the reporter
        RuntimeException ex = assertThrows(RuntimeException.class, () -> claimService.submitClaim(claimDto, reporter));
        assertTrue(ex.getMessage().contains("cannot claim your own"));
        verify(claimRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should prevent submitting duplicate claim for same item")
    void submitClaim_DuplicateClaim_ThrowsException() {
        when(itemRepository.findById(10L)).thenReturn(Optional.of(foundItem));
        when(claimRepository.existsByItemAndClaimant(foundItem, claimant)).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> claimService.submitClaim(claimDto, claimant));
        assertTrue(ex.getMessage().contains("already submitted a claim"));
        verify(claimRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should approve claim and update item status to CLAIMED")
    void updateClaimStatus_Approved_UpdatesItemStatus() {
        Claim pendingClaim = Claim.builder()
                .id(200L)
                .item(foundItem)
                .claimant(claimant)
                .status(Claim.ClaimStatus.PENDING)
                .build();

        when(claimRepository.findById(200L)).thenReturn(Optional.of(pendingClaim));
        when(claimRepository.save(any(Claim.class))).thenAnswer(i -> i.getArgument(0));

        Claim approved = claimService.updateClaimStatus(200L, Claim.ClaimStatus.APPROVED, "Verified proof in person");

        assertEquals(Claim.ClaimStatus.APPROVED, approved.getStatus());
        assertEquals("Verified proof in person", approved.getAdminNotes());
        assertEquals(Item.ItemStatus.CLAIMED, foundItem.getStatus());
        verify(itemRepository, times(1)).save(foundItem);
        verify(notificationService, times(1)).createNotification(eq(claimant), anyString(), anyString(), anyString());
    }
}

