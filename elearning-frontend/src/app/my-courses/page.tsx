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

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Khóa học của tôi</h1>

      {enrollments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Bạn chưa đăng ký khóa học nào.</p>
          <Link href="/" className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition">
            Khám phá khóa học ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col">
              {/* Giả sử entity Course của bạn có thumbnail, nhớ điều chỉnh tên trường cho đúng nhé */}
              <div className="relative h-40 w-full bg-gray-200">
                <Image 
                  src={enrollment.course.imageUrl || '/images/placeholder-course.jpg'} 
                  alt={enrollment.course.title} 
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-2">
                  {enrollment.course.title}
                </h3>
                
                {/* Bạn có thể làm thêm thanh Progress Bar sau, tạm thời cứ để chữ */}
                <p className="text-sm text-gray-500 mb-4">Trạng thái: Đang học</p>

                <div className="mt-auto">
                  {/* Link dẫn sang trang học video (Learning Workspace) */}
                  <Link 
                    href={`/learning/${enrollment.course.id}`} 
                    className="block w-full text-center bg-purple-600 text-white py-2 rounded font-medium hover:bg-purple-700 transition"
                  >
                    Tiếp tục học
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}