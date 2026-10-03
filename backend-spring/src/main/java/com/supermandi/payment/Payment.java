package com.supermandi.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    private String id;
    private String orderId;
    private String userId;
    private Double amount;
    private PaymentMode mode;

    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @CreatedDate
    private LocalDateTime createdAt;
}
