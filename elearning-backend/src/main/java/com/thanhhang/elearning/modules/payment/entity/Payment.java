package com.thanhhang.elearning.modules.payment.entity; // Nhớ đổi package cho đúng nhé

import jakarta.persistence.*;
import lombok.Data; // Nếu bạn có dùng Lombok, không thì tự generate Getter/Setter nhé
import java.util.Date;

@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "amount", nullable = false)
    private Double amount; 

    @Column(name = "provider")
    private String provider; 

    @Column(name = "transaction_no")
    private String transactionNo; 

    @Column(name = "bank_code")
    private String bankCode; 

    @Column(name = "status")
    private String status; 

    @Column(name = "payment_date")
    private Date paymentDate;
}