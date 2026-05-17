'use client';

import { useState, useEffect } from 'react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';
import Link from 'next/link';

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    courseService.getMyTeachingCourses()
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => console.error("Lỗi tải danh sách khóa học:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Hàm format tiền tệ VNĐ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading) {
    return <div className="p-10 text-center text-gray-400">Đang tải danh sách khóa học...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Tiêu đề & Nút thêm mới */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Khóa học của tôi</h1>
          <p className="text-gray-400 text-sm mt-1">Quản lý, chỉnh sửa và cập nhật nội dung các khóa học của bạn.</p>
        </div>
        <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors shadow-md shrink-0">
            <Link href="/instructor/courses/create" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors shadow-md shrink-0">
                + Tạo khóa học mới
            </Link>
        </button>
      </div>

      {/* Trạng thái trống (Chưa có khóa học) */}
      {courses.length === 0 ? (
        <div className="bg-[#1c1d1f] rounded-xl border border-gray-800 p-12 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-white mb-2">Bạn chưa có khóa học nào</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">Hãy bắt đầu chia sẻ kiến thức của bạn và tạo nguồn thu nhập thụ động bằng cách tạo khóa học đầu tiên.</p>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-colors shadow-lg">
            Tạo khóa học ngay
          </button>
        </div>
      ) : (
        /* Lưới hiển thị danh sách khóa học */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(course => (
            <div 
              key={course.id} 
              className="bg-[#1c1d1f] rounded-xl border border-gray-800 overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-all flex flex-col group"
            >
              {/* Hình ảnh & Badge trạng thái */}
              <div className="relative h-48 w-full bg-gray-900 overflow-hidden">
                <img 
                  src={course.imageUrl || 'https://via.placeholder.com/600x400'} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded uppercase tracking-wider shadow-md ${
                    course.status === 'PUBLISHED' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-900'
                  }`}>
                    {course.status || 'DRAFT'}
                  </span>
                </div>
              </div>
              
              {/* Nội dung khóa học */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white line-clamp-2 mb-3 leading-snug group-hover:text-purple-400 transition-colors" title={course.title}>
                  {course.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-5">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    {course.totalStudents || 0} học viên
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {course.rating ? course.rating.toFixed(1) : '0.0'}
                  </span>
                </div>
                
                {/* Khu vực giá & Nút Action */}
                <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-xl font-bold text-white">
                    {formatCurrency(course.price || 0)}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors" title="Chỉnh sửa khóa học">
                      <Link href={`/instructor/courses/${course.id}`} className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors" title="Chỉnh sửa khóa học">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </Link>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Xóa khóa học">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}