package com.thanhhang.elearning.modules.payment.controller;

import com.thanhhang.elearning.config.payment.VNPayConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*") // Nhớ mở CORS
public class PaymentController {

    @Value("${vnpay.tmnCode}")
    private String vnp_TmnCode;

    @Value("${vnpay.hashSecret}")
    private String vnp_HashSecret;

    @Value("${vnpay.payUrl}")
    private String vnp_PayUrl;

    @Value("${vnpay.returnUrl}")
    private String vnp_ReturnUrl;

    @GetMapping("/create-url")
    public Map<String, String> createPaymentUrl(@RequestParam("amount") long amount, @RequestParam("courseId") Long courseId) {
        
        long vnp_Amount = amount * 100; // VNPay quy định số tiền phải nhân 100
        
        // Tạo mã đơn hàng ngẫu nhiên (Ví dụ: 12345678)
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8); 
        
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(vnp_Amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan khoa hoc ID: " + courseId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl); // URL nhận kết quả trả về
        vnp_Params.put("vnp_IpAddr", "127.0.0.1"); // IP giả lập localhost

        // Cấu hình thời gian
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15); // Link thanh toán có hiệu lực 15 phút
        vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        // Sắp xếp và tạo URL
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName).append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        
        // Tạo chữ ký bảo mật
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnp_PayUrl + "?" + queryUrl;

        // Trả URL về cho Frontend dưới dạng JSON
        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return response;
    }
}