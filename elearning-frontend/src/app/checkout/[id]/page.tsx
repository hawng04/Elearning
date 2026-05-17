'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Course } from '@/types/course';
import { courseService } from '@/services/courseService';
import axiosClient from '@/lib/axiosClient';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái đang xoay xoay lúc thanh toán

  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Hàm xử lý khi bấm nút Thanh toán
  const handlePayment = async () => {
    if (!course) return;
    setIsProcessing(true);
    
    try {
      // 1. Gọi sang Spring Boot để nhờ nó tạo Link VNPay mã hóa
      const response = await axiosClient.get('/payment/create-url', {
        params: {
          amount: course.price,
          courseId: course.id
        }
      });

      // 2. Lấy được Link đỏ rực của VNPay thì chuyển hướng luôn
      const paymentUrl = response.data.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl; // Chuyển trang sang cổng VNPay
      } else {
        alert("Không nhận được đường dẫn thanh toán từ máy chủ!");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo giao dịch:", error);
      alert("Đã xảy ra lỗi hệ thống khi kết nối với VNPay. Vui lòng thử lại!");
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center">Đang tải...</div>;
  if (!course) return <div className="min-h-screen flex justify-center items-center">Không tìm thấy khóa học.</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Thanh toán</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Cột trái: Thông tin thanh toán (Giả lập) */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Phương thức thanh toán</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Chuyển khoản ngân hàng (VNPay / Momo)</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 text-gray-400">
                <input type="radio" name="payment" disabled className="w-5 h-5" />
                <span>Thẻ tín dụng/Ghi nợ (Đang bảo trì)</span>
              </label>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Tóm tắt đơn hàng</h2>
            
            <div className="flex gap-4 mb-6">
              <div className="relative w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                <Image src={course.imageUrl || '/placeholder.png'} alt={course.title} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-500">Giảng viên ID: {course.instructorId}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-6 border-t pt-4">
              <span>Tổng cộng:</span>
              <span>{course.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</span>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full font-bold py-4 px-4 text-white transition-colors ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#a435f0] hover:bg-[#8710d8]'}`}
            >
              {isProcessing ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              Bằng việc hoàn tất mua hàng, bạn đồng ý với các Điều khoản dịch vụ của chúng tôi.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}