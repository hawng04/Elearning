'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { Course } from '@/types/course';
import { courseService } from '@/services/courseService';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types/category';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [coursesData, categoriesData] = await Promise.all([
          courseService.getAllCourses(),
          categoryService.getAllCategories()
        ]);
        
        setCourses(coursesData);
        setCategories(categoriesData);

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

      {/* Dùng flex-grow để đẩy Footer xuống tận cùng dưới đáy màn hình */}
      <main className="flex-grow">
        
        {/* 1. HERO BANNER */}
        <div className="relative items-center max-w-7xl h-[400px] mx-auto bg-gray-100 overflow-hidden">
          <Image 
            src="/images/banner.jpg" 
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

        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-10 items-center">
          {/* Cột chữ bên trái */}
          <div className="lg:w-1/3 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif leading-tight">
              Học các kỹ năng <i className="font-serif text-purple-700">thiết yếu</i> cho sự nghiệp và cuộc sống
            </h2>
            <p className="text-gray-600 text-lg">
              Udemy giúp bạn nhanh chóng xây dựng những kỹ năng đang được săn đón và thăng tiến trong một thị trường lao động không ngừng thay đổi.
            </p>
          </div>

          {/* Cột thẻ Card bên phải */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {categories.slice(0, 3).map((category, index) => {
              // Mảng icon ngẫu nhiên nếu DB chưa có ảnh
              const icons = ['🤖', '🏆', '📊', '💻', '🎨', '🌐'];
              const icon = icons[index % icons.length];

              return (
                <div key={category.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow flex flex-col">
                  <div className="h-48 bg-gray-100 relative flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {icon}
                    </span>
                  </div>
                  <div className="p-5 flex justify-between items-center bg-white border-t border-gray-100">
                    {/* Hiển thị tên danh mục từ Database */}
                    <span className="font-bold text-gray-900 text-lg line-clamp-1">{category.name}</span>
                    <span className="text-gray-400 group-hover:text-black transition-colors">→</span>
                  </div>
                </div>
              );
            })}
            
            {categories.length === 0 && !isLoading && (
               <p className="text-gray-500 col-span-3 text-center">Chưa có danh mục nào.</p>
            )}
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
                      Giảng viên ID: {course.instructorId} 
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