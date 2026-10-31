package com.campuslostfound.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimDto {

    private Long itemId;

    @NotBlank(message = "Proof of ownership is required")
    @Size(min = 20, message = "Please provide detailed proof of ownership (minimum 20 characters)")
    private String proofOfOwnership;

    private String additionalInfo;

    private String verificationQuestionAnswer;
}
