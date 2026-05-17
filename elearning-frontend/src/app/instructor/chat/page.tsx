'use client';

import { useState, useEffect } from 'react';
import CourseChat from '@/components/CourseChat';
import { courseService } from '@/services/courseService';

interface Course {
  id: number;
  title: string;
}

export default function InstructorChatPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentUser, setCurrentUser] = useState({ id: 0, name: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    courseService.getMyTeachingCourses()
      .then((data) => {
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]); 
        }
      })
      .catch((err) => console.error("Lỗi lấy khóa học:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-8 text-white">Đang tải dữ liệu...</div>;
  if (courses.length === 0) return <div className="p-8 text-white">Bạn chưa có khóa học nào để thảo luận.</div>;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80 bg-[#1c1d1f] border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-white font-bold">Chọn khóa học</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                selectedCourse?.id === course.id 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-transparent text-gray-400 hover:bg-gray-800'
              }`}
            >
              {course.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        {selectedCourse && (
          <CourseChat 
            key={selectedCourse.id} 
            courseId={selectedCourse.id} 
            currentUser={currentUser} 
          />
        )}
      </div>
    </div>
  );
}