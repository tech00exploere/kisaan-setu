package com.supermandi.payment;

import java.util.List;

/**
 * Payment Service Interface (DIP / ISP).
 */
public interface PaymentService {

    Payment createPayment(String orderId, String userId, Double amount, PaymentMode mode);

    Payment getPaymentByOrderId(String orderId);

    List<Payment> getPaymentsByUserId(String userId);
}
