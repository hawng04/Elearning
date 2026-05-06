package com.thanhhang.elearning.modules.payment.dto; // Đổi lại package cho đúng

import lombok.Data;

@Data
public class PaymentRequest {
    private Double amount;
    private String transactionNo;
    private String bankCode;
    private String provider;
}