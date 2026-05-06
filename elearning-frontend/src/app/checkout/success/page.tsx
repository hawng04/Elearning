'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import Link from 'next/link';
import { enrollmentService } from '@/services/enrollmentService';

// Component con xử lý logic đọc URL
function PaymentResult() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy các tham số VNPay trả về trên URL
  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
  const vnp_Amount = searchParams.get('vnp_Amount');
  const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
  const vnp_BankCode = searchParams.get('vnp_BankCode');

  // VNPay quy định mã '00' là giao dịch thành công
  const isSuccess = vnp_ResponseCode === '00';

  const hasSavedRef = useRef(false);

  useEffect(() => {
    // Nếu thanh toán thành công, có thông tin đơn hàng và chưa lưu lần nào
    if (isSuccess && vnp_OrderInfo && !hasSavedRef.current) {
      hasSavedRef.current = true; // Đánh dấu là đã chạy để không gọi API 2 lần
      
      const match = vnp_OrderInfo.match(/ID:\s*(\d+)/);
      const courseId = match ? parseInt(match[1], 10) : null;

      if (courseId) {
        const vnp_Amount = searchParams.get('vnp_Amount');
        const vnp_TransactionNo = searchParams.get('vnp_BankTranNo') || searchParams.get('vnp_TransactionNo');
        const vnp_BankCode = searchParams.get('vnp_BankCode');
        const paymentData = {
          amount: vnp_Amount ? Number(vnp_Amount) / 100 : 0, // Nhớ chia 100
          transactionNo: vnp_TransactionNo,
          bankCode: vnp_BankCode,
          provider: 'VNPAY'
        };
  
        // 3. Gọi service truyền cả courseId và paymentData
        enrollmentService.enrollCourse(courseId, paymentData)
          .then((data) => console.log('🎉 Ghi danh và lưu hóa đơn thành công!', data))
          .catch(err => console.error('Lỗi khi ghi danh:', err));
      }
    }
  }, [isSuccess, vnp_OrderInfo]);
  // Định dạng lại số tiền (VNPay nhân 100 lên nên giờ phải chia 100 đi)
  const amountToDisplay = vnp_Amount 
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(vnp_Amount) / 100)
    : '0 ₫';


  

  return (
    <div className="bg-gray-50 min-h-screen py-16 flex justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full text-center h-fit border border-gray-200">
        
        {isSuccess ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-600 mb-6">Cảm ơn bạn đã mua khóa học. Chúc bạn học tập thật tốt!</p>
            
            <div className="bg-gray-50 p-4 rounded text-left text-sm space-y-3 mb-8">
              <div className="flex justify-between"><span className="text-gray-500">Số tiền:</span> <span className="font-bold text-[#a435f0]">{amountToDisplay}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Ngân hàng:</span> <span className="font-medium text-gray-800">{vnp_BankCode}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Nội dung:</span> <span className="font-medium text-gray-800 text-right">{vnp_OrderInfo}</span></div>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
            <p className="text-gray-600 mb-8">Giao dịch đã bị hủy hoặc có lỗi xảy ra. Vui lòng thử lại.</p>
          </>
        )}

        <div className="flex flex-col gap-3">
          {isSuccess && (
            <Link href="/" className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold py-3 px-4 rounded transition-colors inline-block">
              Vào học ngay
            </Link>
          )}
          <button onClick={() => router.push('/')} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded transition-colors">
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

// Bọc Component trong Suspense để Next.js không báo lỗi khi dùng useSearchParams
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Đang tải dữ liệu...</div>}>
      <PaymentResult />
    </Suspense>
  );
}