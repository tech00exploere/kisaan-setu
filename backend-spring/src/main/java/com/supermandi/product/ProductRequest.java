package com.supermandi.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductRequest(
    @NotBlank String name,
    String description,
    @NotNull @Min(0) Double price,
    @NotBlank String category,
    String imageUrl,
    String unit,
    String quantity,
    String location,
    String farmerName,
    Integer forecast
) {}
