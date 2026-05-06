package com.thanhhang.elearning.modules.payment.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// ... các import khác ...

import com.thanhhang.elearning.modules.payment.dto.PaymentRequest;
import com.thanhhang.elearning.modules.payment.entity.Payment;
import com.thanhhang.elearning.modules.payment.repository.PaymentRepository;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public void savePayment(Long courseId, Long studentId, PaymentRequest request) {
        if (request == null) return;
        
        Payment payment = new Payment();
        payment.setCourseId(courseId);
        payment.setStudentId(studentId);
        payment.setAmount(request.getAmount());
        payment.setTransactionNo(request.getTransactionNo());
        payment.setBankCode(request.getBankCode()); 
        payment.setProvider(request.getProvider());
        payment.setStatus("SUCCESS");
        payment.setPaymentDate(new Date());
        
        paymentRepository.save(payment);
    }
}