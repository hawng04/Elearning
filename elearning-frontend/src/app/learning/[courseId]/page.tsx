'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { courseService } from '@/services/courseService';

export default function LearningWorkspace() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm chuyển đổi Link YouTube thường thành Link Embed để không bị lỗi "refused to connect"
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  useEffect(() => {
    if (!courseId) return;

    courseService.getCourseById(Number(courseId))
      .then((data: any) => {
        setCourse(data);
        // Tự động tìm và chọn bài học đầu tiên có chứa video
        if (data?.sections?.length > 0) {
          for (let section of data.sections) {
            if (section.lessons?.length > 0) {
              setActiveLesson(section.lessons[0]);
              break;
            }
          }
        }
      })
      .catch((err) => console.error('Lỗi khi lấy chi tiết khóa học:', err))
      .finally(() => setIsLoading(false));
  }, [courseId]);

  if (isLoading) {
    return (
      <div style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} className="fixed top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!course) return null;

  return (
    // 1. LỚP NỀN ĐEN MỜ BAO PHỦ TOÀN MÀN HÌNH (Dùng style RGB cho chắc ăn 100%)
    <div style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} className="fixed top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center p-4 font-sans">
      
      {/* 2. HỘP MODAL CHÍNH - Ép cứng chiều rộng tối đa 750px (Giống hệt Udemy) */}
      <div style={{ maxWidth: '750px', maxHeight: '92vh' }} className="bg-[#1c1d1f] w-full flex flex-col rounded-xl overflow-hidden shadow-2xl">
        
        {/* === Header của hộp === */}
        <div className="p-5 flex justify-between items-start border-b border-gray-800 shrink-0">
          <div>
            <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Xem trước khóa học</p>
            <h2 className="text-white text-lg font-bold line-clamp-1">{course.title}</h2>
          </div>
          <button 
            onClick={() => router.push('/my-courses')} 
            className="text-gray-400 hover:text-white p-1 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* === KHUNG VIDEO (Dùng thủ thuật Padding Bottom 56.25% để ép tỷ lệ 16:9 vĩnh viễn) === */}
        <div style={{ paddingTop: '56.25%', position: 'relative' }} className="w-full bg-black shrink-0">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} className="flex items-center justify-center">
            {activeLesson?.videoUrl ? (
              <iframe 
                src={getEmbedUrl(activeLesson.videoUrl)} 
                style={{ width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                 <svg className="w-12 h-12 mb-2 opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                 <span>Video chưa sẵn sàng</span>
              </div>
            )}
          </div>
        </div>

        {/* === Dòng chữ "Video mẫu miễn phí / Danh sách bài học" === */}
        <div className="bg-[#1c1d1f] px-5 py-4 border-b border-gray-800 shrink-0">
          <h3 className="text-white font-bold text-sm">Danh sách bài học khóa học:</h3>
        </div>

        {/* === Danh sách bài học cuộn được === */}
        <div 
          className="overflow-y-auto flex-1 bg-[#1c1d1f]" 
          style={{ 
            minHeight: '200px', 
            maxHeight: '400px', // Giới hạn chiều cao để bắt buộc hiện thanh cuộn
            overflowY: 'auto' 
          }}
        >
          {course.sections && course.sections.length > 0 ? (
            course.sections.map((section: any, sIdx: number) => (
              <div key={section.id || sIdx}>
                {/* Tên Chương */}
                <div className="px-5 py-3 bg-[#2d2f31] text-gray-300 font-bold text-xs uppercase tracking-wide border-b border-gray-700">
                   Chương {sIdx + 1}: {section.title}
                </div>

                {/* Danh sách bài học trong chương đó */}
                {section.lessons && section.lessons.length > 0 ? (
                  section.lessons.map((lesson: any, lIdx: number) => {
                    const isActive = activeLesson?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id || lIdx}
                        onClick={() => setActiveLesson(lesson)}
                        style={{ backgroundColor: isActive ? '#3e4143' : 'transparent' }}
                        className="w-full flex items-center gap-4 px-5 py-4 text-left border-b border-gray-800 transition-colors hover:bg-[#3e4143]"
                      >
                        {/* Thumbnail bài học */}
                        <div style={{ width: '80px', height: '45px', backgroundColor: '#111' }} className="shrink-0 flex justify-center items-center rounded relative border border-gray-700">
                           {isActive ? (
                              <div style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} className="absolute inset-0 flex items-center justify-center">
                                <span style={{ color: '#a855f7', fontSize: '10px', fontWeight: 'bold' }}>▶</span>
                              </div>
                           ) : (
                              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                           )}
                        </div>

                        {/* Tiêu đề bài học */}
                        <div className="flex-1 pr-4">
                          <p style={{ color: isActive ? '#ffffff' : '#d1d5db', fontWeight: isActive ? 'bold' : '500' }} className="text-sm">
                             {lIdx + 1}. {lesson.title}
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-xs text-gray-500 italic">Chương này chưa có bài học</div>
                )}
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-500">Khóa học này chưa có nội dung</div>
          )}
        </div>

      </div>
    </div>
  );
}