'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { enrollmentService } from '@/services/enrollmentService';
import { Enrollment } from '@/types/enrollment';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy dữ liệu khi trang vừa load
    enrollmentService.getMyEnrollments()
      .then((data) => {
        setEnrollments(data);
      })
      .catch((err) => {
        console.error('Lỗi khi lấy danh sách khóa học:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-[80vh] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 font-serif">Khóa học của tôi</h1>

        {isLoading ? (
          // === HIỆU ỨNG ĐANG TẢI (SKELETON LOADING) ===
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-sm h-72 animate-pulse flex flex-col overflow-hidden border border-gray-100">
                <div className="bg-gray-200 h-40 w-full"></div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="mt-auto h-2 bg-gray-200 rounded-full w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          // === TRẠNG THÁI TRỐNG (CHƯA MUA KHÓA NÀO) ===
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Bạn chưa bắt đầu khóa học nào</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Khi bạn ghi danh vào một khóa học, khóa học đó sẽ xuất hiện tại đây để bạn tiện theo dõi.</p>
            <Link href="/" className="inline-block bg-purple-600 text-white font-bold px-8 py-3 rounded-md hover:bg-purple-700 transition shadow-md">
              Khám phá khóa học ngay
            </Link>
          </div>
        ) : (
          // === DANH SÁCH KHÓA HỌC ĐÃ MUA ===
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrollments.map((enrollment) => {
              const progressPercentage: number = enrollment.progress || 0; 

              return (
                <div key={enrollment.id} className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  
                  {/* Ảnh bìa khóa học */}
                  <div className="relative h-40 w-full bg-gray-200 overflow-hidden cursor-pointer">
                    <Link href={`/learning/${enrollment.course.id}`}>
                      <Image 
                        src={enrollment.course.imageUrl || '/images/placeholder-course.jpg'} 
                        alt={enrollment.course.title} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized // Tránh lỗi Next/Image nếu dùng link ảnh ngoài
                      />
                      {/* Lớp phủ & Icon Play hiện ra khi di chuột vào ảnh */}
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          <svg className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Khung Thông tin */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-600 transition-colors">
                      <Link href={`/learning/${enrollment.course.id}`}>
                         {enrollment.course.title}
                      </Link>
                    </h3>
                    
                    {/* Hiển thị Tên giảng viên nếu có, không thì để trống */}
                    <p className="text-xs text-gray-500 mb-4 line-clamp-1">
                      {enrollment.course.teacherId ? `ID Giảng viên: ${enrollment.course.teacherId}` : 'Khóa học tiêu chuẩn'}
                    </p>

                    <div className="mt-auto">
                      {/* Thanh Tiến Độ (Progress Bar) */}
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-semibold text-gray-500">{progressPercentage}% hoàn thành</span>
                        {progressPercentage === 100 && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                            Hoàn thành
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-1000 ${progressPercentage === 100 ? 'bg-yellow-400' : 'bg-purple-600'}`} 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>

                      {/* Nút bấm */}
                      <Link 
                        href={`/learning/${enrollment.course.id}`} 
                        className="block w-full text-center bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-100 font-semibold py-2.5 rounded transition-colors duration-300"
                      >
                        {progressPercentage === 0 ? 'Bắt đầu học' : progressPercentage === 100 ? 'Học lại' : 'Tiếp tục học'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}