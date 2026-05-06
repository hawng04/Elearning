'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Course } from '@/types/course';
import { courseService } from '@/services/courseService';

export default function CourseDetailPage() {
  const params = useParams(); 
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // State quản lý đóng/mở các chương (Accordion)
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(courseId);
        setCourse(data);
      } catch (err: any) {
        setError('Không thể tải thông tin khóa học.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) => 
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const toggleAll = () => {
    if (course?.sections) {
      if (expandedSections.length === course.sections.length) setExpandedSections([]);
      else setExpandedSections(course.sections.map(s => s.id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-bold text-red-600">
        {error || 'Khóa học không tồn tại!'}
      </div>
    );
  }

  const originalPrice = course.price > 0 ? course.price * 1.5 : 0;

  return (
    <div className="bg-white font-sans text-gray-900 pb-20">
      
      {/* 1. KHU VỰC HERO BANNER (NỀN ĐEN) */}
      <div className="bg-[#1c1d1f] text-white pt-8 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col relative lg:pr-[400px]">
          
          <div className="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2">
            <span className="hover:text-purple-300 cursor-pointer">Phát triển</span>
            <span>{'>'}</span>
            <span className="hover:text-purple-300 cursor-pointer">{course.categoryName}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{course.title}</h1>
          <p className="text-lg text-gray-100 mb-6 line-clamp-2">{course.description}</p>

          {/* LẤY DỮ LIỆU THẬT: ĐÁNH GIÁ & HỌC VIÊN */}
          <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
            {(course.rating || 0) >= 4.5 && <span className="bg-[#eceb98] text-[#3d3c0a] font-bold px-2 py-1 text-xs">Bán chạy nhất</span>}
            <span className="text-yellow-400 font-bold">{course.rating || 0} ⭐⭐⭐⭐⭐</span>
            <span className="text-purple-300 underline">({course.totalRatings || 0} xếp hạng)</span>
            <span>{course.totalStudents || 0} học viên</span>
          </div>

          <div className="text-sm mb-4">
            Được tạo bởi <span className="text-purple-300 underline cursor-pointer">Giảng viên ID {course.teacherId}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-white">
            <span className="flex items-center gap-1">⚠️ Cập nhật gần đây nhất {course.lastUpdated || "Đang cập nhật"}</span>
            <span className="flex items-center gap-1">🌐 {course.language || "Tiếng Việt"}</span>
          </div>
        </div>
      </div>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (NỀN TRẮNG) */}
      <div className="max-w-7xl mx-auto px-6 relative flex flex-col-reverse lg:flex-row gap-12 items-start">
        
        {/* CỘT TRÁI */}
        <div className="w-full lg:w-2/3 pt-10 space-y-10">
          
          {/* LẤY DỮ LIỆU THẬT: NỘI DUNG BÀI HỌC (Benefits) */}
          <div className="border border-gray-300 p-6 rounded-sm">
            <h2 className="text-2xl font-bold mb-4">Bạn sẽ học được gì</h2>
            {course.benefits && course.benefits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                {course.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="text-gray-900 min-w-[15px]">✓</span> 
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">Giảng viên đang cập nhật lợi ích khóa học...</p>
            )}
          </div>

          {/* LẤY DỮ LIỆU THẬT: CÁC CHƯƠNG MỤC (Sections - Accordion chuẩn Udemy) */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
              <div>
                <h2 className="text-2xl font-bold">Nội dung khóa học</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {/* Mock tổng số bài giảng và thời lượng vì Backend chưa tính tổng */}
                  {course.sections?.length || 0} phần • 181 bài giảng • 22 giờ 44 phút tổng thời lượng
                </p>
              </div>
              <button onClick={toggleAll} className="text-[#5624d0] font-bold text-sm hover:text-[#401b9c] text-left">
                {course.sections && expandedSections.length === course.sections.length ? 'Thu gọn tất cả các phần' : 'Mở rộng tất cả các phần'}
              </button>
            </div>

            {course.sections && course.sections.length > 0 ? (
              <div className="border border-gray-300 rounded-sm bg-white">
                {course.sections.map((section) => {
                  const isExpanded = expandedSections.includes(section.id);
                  return (
                    <div key={section.id} className="flex flex-col border-b border-gray-300 last:border-b-0">
                      
                      {/* 1. THANH TIÊU ĐỀ CHƯƠNG */}
                      <div 
                        onClick={() => toggleSection(section.id)} 
                        className="p-4 bg-[#fbfbf8] flex items-center justify-between cursor-pointer hover:bg-[#f7f9fa] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-gray-900 text-[10px] font-bold transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            ▲
                          </span>
                          <span className="font-bold text-gray-900 text-base">{section.title}</span>
                        </div>
                        <span className="text-sm text-gray-600 hidden md:block">
                          {section.lessons?.length || 0} bài giảng • 12 phút
                        </span>
                      </div>
                      
                      {/* 2. DANH SÁCH BÀI GIẢNG BÊN TRONG */}
                      {isExpanded && (
                        <div className="bg-white py-2">
                           {section.lessons && section.lessons.length > 0 ? (
                             <ul className="flex flex-col">
                                {section.lessons.map((lesson) => (
                                  <li key={lesson.id} className="flex items-center justify-between py-2 px-4 md:px-8 hover:bg-gray-50">
                                    
                                    {/* Cột trái: Icon + Tên bài */}
                                    <div className="flex items-center gap-4">
                                      {/* Icon Play dạng SVG */}
                                      <svg className="w-4 h-4 min-w-[16px] text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      
                                      <span className={`text-sm ${lesson.isFreePreview ? 'text-[#5624d0] hover:text-[#401b9c] cursor-pointer' : 'text-gray-800'}`}>
                                        {lesson.title}
                                      </span>
                                    </div>

                                    {/* Cột phải: Xem trước + Thời gian */}
                                    <div className="flex items-center gap-4 text-sm">
                                      {lesson.isFreePreview && (
                                        <span className="text-[#5624d0] underline cursor-pointer hover:text-[#401b9c] hidden md:flex items-center gap-1">
                                          {/* Icon Play hình tròn đặc cho phần Xem trước */}
                                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                                          </svg>
                                          Xem trước
                                        </span>
                                      )}
                                      <span className="text-gray-500 w-10 text-right">
                                        {lesson.duration || "0:00"}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                             </ul>
                           ) : (
                             <p className="text-gray-500 italic px-8 py-2 text-sm">Danh sách bài giảng đang được cập nhật...</p>
                           )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600">Giảng viên đang cập nhật nội dung cho khóa học này.</p>
            )}
          </div>

          {/* LẤY DỮ LIỆU THẬT: YÊU CẦU (Requirements) */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Yêu cầu</h2>
            {course.requirements && course.requirements.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-sm">Không có yêu cầu đặc biệt nào.</p>
            )}
          </div>

          {/* MÔ TẢ */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Mô tả chi tiết</h2>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {course.description || "Chưa có mô tả chi tiết."}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (Thẻ nổi Floating Card) */}
        <div className="w-full lg:w-[340px] lg:absolute lg:top-[-300px] lg:right-6 lg:z-20">
          <div className="bg-white rounded-sm shadow-xl border border-gray-200 lg:sticky lg:top-8 overflow-hidden">
            
            <div className="relative w-full h-48 bg-gray-100 border-b border-gray-200">
              <Image src={course.imageUrl || 'https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg'} alt={course.title} fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 cursor-pointer group hover:bg-opacity-10 transition-all">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl ml-1">▶</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-end gap-2 mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {course.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                </div>
                {originalPrice > 0 && (
                  <div className="text-lg text-gray-500 line-through mb-1">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalPrice)}
                  </div>
                )}
              </div>

              <button 
                onClick={() => router.push(`/checkout/${course.id}`)}
                className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold py-4 px-4 mb-4 transition-colors text-lg"
              >
                {course.price === 0 ? 'Đăng ký học ngay' : 'Mua ngay'}
              </button>

              <div className="text-xs text-center text-gray-500 mb-6">
                Đảm bảo hoàn tiền trong 30 ngày
              </div>

              {/* LẤY DỮ LIỆU THẬT: KHÓA HỌC BAO GỒM (Includes) */}
              <div>
                <h3 className="font-bold mb-2">Khóa học này bao gồm:</h3>
                {course.includes && course.includes.length > 0 ? (
                  <ul className="text-sm text-gray-600 space-y-2">
                    {course.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="min-w-[20px]">✨</span> {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-xs">Thông tin đang cập nhật...</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}