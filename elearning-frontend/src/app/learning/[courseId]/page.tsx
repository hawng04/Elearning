'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { courseService } from '@/services/courseService';
import YouTube from 'react-youtube';
import { lessonService } from '@/services/lessonService';

// IMPORT COMPONENT CHAT VÀ STORE ZUSTAND
import CourseChat from '@/components/CourseChat';
import { useAuthStore } from '@/store/useAuthStore';

export default function LearningWorkspace() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  
  // STATE QUẢN LÝ TAB
  const [activeTab, setActiveTab] = useState<'lessons' | 'chat'>('lessons');

  // LẤY THÔNG TIN USER TỪ ZUSTAND
  const authUser = useAuthStore((state) => state.user);
  
  // MAP DATA ĐỂ TRUYỀN VÀO COURSE CHAT
  const currentUser = authUser ? { 
    id: authUser.id, 
    name: authUser.fullName 
  } : null;

  // LẤY DỮ LIỆU KHÓA HỌC VÀ TIẾN ĐỘ HỌC TẬP
  useEffect(() => {
    if (!courseId) return;

    setIsLoading(true);

    // Dùng Promise.all để gọi song song 2 API cho nhanh
    Promise.all([
      courseService.getCourseById(Number(courseId)),
      lessonService.getCompletedLessons(Number(courseId)).catch(() => [])
    ])
      // Ép kiểu [any, any] ở đây để TypeScript không báo lỗi đỏ
      .then(([courseData, completedLessonsData]: [any, any]) => {
        
        // 1. SET DỮ LIỆU KHÓA HỌC
        setCourse(courseData);

        // 2. SET DỮ LIỆU TIẾN ĐỘ VÀO STATE
        if (completedLessonsData && Array.isArray(completedLessonsData)) {
          const ids = completedLessonsData.map((item: any) => 
            typeof item === 'object' ? (item.lessonId || item.lesson_id || item.id) : item
          );
          setCompletedLessonIds(ids);
        }

        // 3. TÌM BÀI HỌC ĐANG HỌC DỞ ĐỂ PHÁT VIDEO
        if (courseData?.sections?.length > 0) {
          let foundUncompleted = false;
          
          // Thêm || [] để báo với TypeScript rằng đây luôn là 1 mảng an toàn
          const sections = courseData.sections || [];

          for (let section of sections) {
            const lessons = section.lessons || [];
            
            for (let lesson of lessons) {
              const isCompleted = completedLessonsData.some((item: any) => 
                (typeof item === 'object' ? (item.lessonId || item.lesson_id || item.id) : item) === lesson.id
              );

              if (!isCompleted) {
                setActiveLesson(lesson);
                foundUncompleted = true;
                break;
              }
            }
            if (foundUncompleted) break;
          }

          // Nếu đã hoàn thành hết sạch thì focus vào bài cuối cùng
          if (!foundUncompleted) {
            const lastSection = sections[sections.length - 1];
            if (lastSection && lastSection.lessons?.length > 0) {
              setActiveLesson(lastSection.lessons[lastSection.lessons.length - 1]);
            }
          }
        }
      })
      .catch((err) => console.error('Lỗi khi lấy dữ liệu:', err))
      .finally(() => setIsLoading(false));
  }, [courseId]);

  // HÀM XỬ LÝ KHI XEM XONG VIDEO HOẶC BẤM NÚT HOÀN THÀNH
  const handleVideoEnd = async () => {
    if (!activeLesson || !course) return;

    try {
      await lessonService.markAsCompleted(Number(courseId), activeLesson.id); 
      
      if (!completedLessonIds.includes(activeLesson.id)) {
        setCompletedLessonIds(prev => [...prev, activeLesson.id]);
      }

      // Tự động chuyển sang bài tiếp theo
      let foundCurrent = false;
      const sections = course.sections || [];
      
      for (const section of sections) {
        const lessons = section.lessons || [];
        for (const lesson of lessons) {
          if (foundCurrent) {
            setActiveLesson(lesson); 
            return; 
          }
          if (lesson.id === activeLesson.id) {
            foundCurrent = true; 
          }
        }
      }
      console.log("Đã hoàn thành toàn bộ khóa học!");

    } catch (error) {
      console.error("Lỗi khi lưu tiến độ:", error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} className="fixed top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} className="fixed top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center p-4 font-sans">
      
      {/* KHUNG MAIN CHÍNH CỦA POPUP NÀY */}
      <div style={{ maxWidth: '550px' }} className="bg-[#1c1d1f] w-full max-h-[95vh] flex flex-col rounded-xl overflow-hidden shadow-2xl">
        
        {/* === HEADER CỦA HỘP === */}
        <div className="p-5 flex justify-between items-start border-b border-gray-800 shrink-0">
          <div>
            <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Xem trước khóa học</p>
            <h2 className="text-white text-lg font-bold line-clamp-1">{course.title}</h2>
          </div>
          <button onClick={() => router.push('/my-courses')} className="text-gray-400 hover:text-white p-1 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* === KHUNG VIDEO === */}
        <div className="w-full bg-black shrink-0 relative aspect-video max-h-[400px]">
          <div className="absolute inset-0 flex items-center justify-center">
            {activeLesson?.youtubeVideoId ? (
              <YouTube 
                videoId={activeLesson.youtubeVideoId} 
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                    rel: 0,
                    modestbranding: 1
                  }
                }}
                onEnd={handleVideoEnd}
                style={{ width: '100%', height: '100%' }}
                iframeClassName="w-full h-full border-none"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                 <svg className="w-12 h-12 mb-2 opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                 <span>Video chưa sẵn sàng</span>
              </div>
            )}
          </div>
        </div>

        {/* === ACTION BAR: TIÊU ĐỀ BÀI HỌC VÀ NÚT HOÀN THÀNH === */}
        {activeLesson && (
          <div className="bg-[#1c1d1f] p-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
            <h3 className="text-white font-bold text-lg line-clamp-2 flex-1">
              {activeLesson.title}
            </h3>
            
            <button
              onClick={handleVideoEnd} 
              disabled={completedLessonIds.includes(activeLesson.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded text-sm font-bold transition-all ${
                completedLessonIds.includes(activeLesson.id)
                  ? 'bg-transparent border border-green-500 text-green-500 cursor-default'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
              }`}
            >
              {completedLessonIds.includes(activeLesson.id) ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  Đã hoàn thành
                </>
              ) : (
                <>
                  Đánh dấu hoàn thành & Tiếp tục
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* === TABS ĐIỀU HƯỚNG === */}
        <div className="bg-[#1c1d1f] flex border-b border-gray-800 shrink-0">
          <button 
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'lessons' ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
          >
            Nội dung khóa học
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'chat' ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
          >
            Hỏi đáp & Thảo luận
          </button>
        </div>

        {/* === NỘI DUNG HIỂN THỊ DƯỚI TABS === */}
        <div className="overflow-y-auto flex-1 bg-[#1c1d1f] min-h-[300px] max-h-[500px]">
          
          {/* TAB: DANH SÁCH BÀI HỌC */}
          {activeTab === 'lessons' && (
            <div>
              {course.sections && course.sections.length > 0 ? (
                course.sections.map((section: any, sIdx: number) => (
                  <div key={section.id || sIdx}>
                    <div className="px-5 py-3 bg-[#2d2f31] text-gray-300 font-bold text-xs uppercase tracking-wide border-b border-gray-700">
                      Chương {sIdx + 1}: {section.title}
                    </div>

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
                            {/* THUMBNAIL */}
                            <div style={{ width: '80px', height: '45px', backgroundColor: '#111' }} className="shrink-0 flex justify-center items-center rounded relative border border-gray-700 overflow-hidden">
                              {lesson.thumbnailUrl && (
                                <img src={lesson.thumbnailUrl} alt={lesson.title} className="w-full h-full object-cover opacity-60" />
                              )}
                              
                              {completedLessonIds.includes(lesson.id) ? (
                                  <div style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                  </div>
                              ) : isActive ? (
                                  <div style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} className="absolute inset-0 flex items-center justify-center">
                                    <span style={{ color: '#a855f7', fontSize: '10px', fontWeight: 'bold' }}>▶</span>
                                  </div>
                              ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                  </div>
                              )}
                            </div>

                            {/* TEXT INFO */}
                            <div className="flex-1 pr-4">
                              <p style={{ color: isActive ? '#ffffff' : '#d1d5db', fontWeight: isActive ? 'bold' : '500' }} className="text-sm line-clamp-2 mb-1">
                                {lIdx + 1}. {lesson.title}
                              </p>
                              {lesson.durationFormatted && (
                                <p className="text-xs text-gray-500">{lesson.durationFormatted}</p>
                              )}
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
          )}

          {/* TAB: THẢO LUẬN (CHAT) */}
          {activeTab === 'chat' && (
            currentUser ? (
              <CourseChat courseId={courseId} currentUser={currentUser} />
            ) : (
              <div className="flex flex-col items-center justify-center p-10 mt-10 text-center text-gray-400 h-full">
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" /></svg>
                <p>Vui lòng đăng nhập để tham gia thảo luận khóa học.</p>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}