package com.supermandi.order;

import jakarta.validation.constraints.NotBlank;

public record OrderRequest(
    @NotBlank String paymentMode,
    @NotBlank String fullName,
    @NotBlank String address,
    @NotBlank String city,
    @NotBlank String state,
    @NotBlank String pincode
) {}
