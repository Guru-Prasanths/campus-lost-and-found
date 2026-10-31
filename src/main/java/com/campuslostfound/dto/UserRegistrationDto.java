package com.campuslostfound.dto;

import com.campuslostfound.model.User;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegistrationDto {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    private String fullName;

    @NotBlank(message = "College ID is required")
    private String collegeId;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;

    @Pattern(regexp = "^$|^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    private String department;

    private String yearOfStudy;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Please confirm your password")
    private String confirmPassword;

    @Builder.Default
    private User.UserRole role = User.UserRole.STUDENT;

    public boolean passwordsMatch() {
        return password != null && password.equals(confirmPassword);
    }
}
