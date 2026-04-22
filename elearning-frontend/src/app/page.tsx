'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import axiosClient from '@/lib/axiosClient';
import { Course } from '@/types/course';
import { courseService } from '@/services/courseService';


export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data  = await courseService.getAllCourses();
        setCourses(data);
      } catch (err: any) {
        setError('Không thể tải danh sách khóa học lúc này.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      <Header />

      <main className="flex-grow">
        <div className="relative w-full h-[400px] bg-gray-100 overflow-hidden">
          <Image 
            src="/images/learning-management-system.webp" 
            alt="Hero Banner" 
            fill
            className="object-cover object-right md:object-center opacity-20 md:opacity-100"
            priority
          />
          <div className="absolute inset-0 flex items-center max-w-7xl mx-auto px-6">
            <div className="bg-white p-8 shadow-lg max-w-md z-10">
              <h1 className="text-4xl font-bold font-serif mb-3 text-gray-900">
                Mở rộng kỹ năng của bạn
              </h1>
              <p className="text-lg text-gray-700 mb-4">
                Học từ các chuyên gia thực chiến. Bắt đầu ngay hôm nay để làm chủ tương lai của bạn.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-2">Những khóa học hàng đầu</h2>
          <p className="text-gray-600 text-lg mb-8">Khám phá các khóa học đang được yêu thích nhất hiện nay.</p>

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {!isLoading && !error && courses.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xl text-gray-600 font-medium">Hiện chưa có khóa học nào trên hệ thống.</p>
              <p className="text-gray-500 mt-2">Giảng viên đang trong quá trình chuẩn bị bài giảng. Vui lòng quay lại sau!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
                <Link href={`/courses/${course.id}`} key={course.id} className="group cursor-pointer flex flex-col">
                  
                  <div className="relative w-full h-40 mb-2 border border-gray-200 bg-gray-100 overflow-hidden">
                    <Image
                      src={course.imageUrl || 'https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg'} 
                      alt={course.title}
                      fill
                      className="object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-bold text-base leading-tight mb-1 group-hover:text-purple-700 line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 mb-1">
                      Giảng viên ID: {course.teacherId} 
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded">
                        {course.categoryName}
                      </span>
                    </div>

                    <div className="mt-auto pt-2 font-bold text-lg text-gray-900">
                      {course.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}