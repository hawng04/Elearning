'use client';

import { useState, useEffect } from 'react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';

// Component Thẻ Thống Kê
const StatCard = ({ title, value, trend, isUp }: { title: string, value: string | number, trend?: string, isUp?: boolean }) => (
  <div className="bg-[#1c1d1f] p-6 rounded-xl border border-gray-800 shadow-sm flex flex-col justify-center">
    <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    {trend && (
      <div className={`text-xs font-semibold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
        {isUp ? '↑' : '↓'} {trend} so với tháng trước
      </div>
    )}
  </div>
);

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [instructorName, setInstructorName] = useState('Giảng viên');

  // State lưu trữ các con số thống kê
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    averageRating: '0.0'
  });

  useEffect(() => {
    // 1. Lấy tên Giảng viên từ LocalStorage
    const storageStr = localStorage.getItem('auth-storage');
    if (storageStr) {
      try {
        const parsed = JSON.parse(storageStr);
        const userData = parsed?.state?.user;
        if (userData && (userData.fullName || userData.name)) {
          setInstructorName(userData.fullName || userData.name);
        }
      } catch (error) {
        console.error("Lỗi đọc storage:", error);
      }
    }

    // 2. Gọi API lấy danh sách khóa học thật
    courseService.getMyTeachingCourses()
      .then((data) => {
        setCourses(data);
        
        // 3. Tính toán thống kê dựa trên dữ liệu thật
        let rev = 0;
        let stu = 0;
        let totalRat = 0;
        let validRatingCount = 0;

        data.forEach(course => {
          const students = course.totalStudents || 0;
          const price = course.price || 0;
          
          stu += students;
          rev += (price * students); // Doanh thu = Giá * Số lượng học viên

          if (course.rating && course.rating > 0) {
            totalRat += course.rating;
            validRatingCount++;
          }
        });

        const avgRat = validRatingCount > 0 ? (totalRat / validRatingCount).toFixed(1) : '0.0';

        setStats({
          totalRevenue: rev,
          totalStudents: stu,
          averageRating: avgRat
        });
      })
      .catch((err) => console.error("Lỗi tải dữ liệu Dashboard:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Format tiền tệ VNĐ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading) return <div className="p-8 text-white flex justify-center mt-10">Đang tải dữ liệu tổng quan...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Lời chào */}
      <div>
        <h1 className="text-2xl font-bold text-white">Chào mừng trở lại, {instructorName}! 👋</h1>
        <p className="text-gray-400 mt-1">Dưới đây là tình hình hoạt động các khóa học của bạn.</p>
      </div>

      {/* Grid Thống kê (Dữ liệu thật) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Tổng doanh thu ước tính" 
          value={formatCurrency(stats.totalRevenue)} 
          trend="12%" isUp={true} 
        />
        <StatCard 
          title="Tổng số học viên" 
          value={stats.totalStudents} 
          trend="5" isUp={true} 
        />
        <StatCard 
          title="Đánh giá trung bình" 
          value={`${stats.averageRating} ⭐`} 
        />
      </div>

      {/* Danh sách khóa học (Dữ liệu thật) */}
      <div className="bg-[#1c1d1f] rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Khóa học đang hoạt động ({courses.length})</h3>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors">Xem tất cả</button>
        </div>
        
        {courses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Bạn chưa tạo khóa học nào.</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {courses.map((course) => (
              <div key={course.id} className="p-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                <div className="flex gap-4 items-center">
                  <img 
                    src={course.imageUrl || 'https://via.placeholder.com/150'} 
                    alt={course.title} 
                    className="w-20 h-12 object-cover rounded shadow-sm"
                  />
                  <div>
                    <h4 className="text-white font-medium line-clamp-1">{course.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {course.totalStudents || 0} học viên • {course.rating ? `${course.rating} ⭐` : 'Chưa có đánh giá'}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-bold">{formatCurrency(course.price || 0)}</div>
                  <span className={`inline-block mt-1 px-2 py-1 text-[10px] font-bold rounded uppercase ${
                    course.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {course.status || 'DRAFT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}