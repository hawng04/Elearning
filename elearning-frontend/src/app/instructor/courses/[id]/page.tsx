'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { courseService } from '@/services/courseService';
import { Section } from '@/types/section';


export default function CourseCurriculumPage() {
  const params = useParams();
  const courseId = params.id; // Lấy ID khóa học từ thanh URL

  // State lưu dữ liệu thật từ hệ thống
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State điều khiển Form nhập liệu
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [newLessonData, setNewLessonData] = useState({ title: '', youtubeUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm tải dữ liệu chương trình học từ API Backend
  const fetchCurriculum = useCallback(async () => {
    if (!courseId) return;
    try {
      const data = await courseService.getCourseCurriculum(courseId as string);
      setSections(Array.isArray(data?.sections) ? data.sections : []);
    } catch (error) {
      console.error('Lỗi khi tải chương trình học:', error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCurriculum();
  }, [fetchCurriculum]);

  // 1. Xử lý gửi API tạo Chương (Section) mới
  const handleAddSection = async () => {
    if (!newSectionTitle.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await courseService.createSection({
        title: newSectionTitle,
        courseId: Number(courseId)
      });
      setNewSectionTitle('');
      setIsAddingSection(false);
      await fetchCurriculum(); // Đồng bộ lại dữ liệu sạch từ DB
    } catch (error) {
      console.error('Lỗi tạo section:', error);
      alert('Không thể tạo chương mới, vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLesson = async (sectionId: number) => {
    if (!newLessonData.title.trim() || !newLessonData.youtubeUrl.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await courseService.createLesson({
        title: newLessonData.title,
        youtubeUrl: newLessonData.youtubeUrl,
        sectionId: sectionId
      });
      setNewLessonData({ title: '', youtubeUrl: '' });
      setActiveSectionId(null);
      await fetchCurriculum(); // Đồng bộ lại dữ liệu sạch để lấy videoId và duration thật
    } catch (error) {
      console.error('Lỗi tạo bài học:', error);
      alert('Không thể thêm bài học, vui lòng kiểm tra lại link video!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isLoading) {
    return <div className="p-10 text-center text-gray-400">Đang tải chương trình giảng dạy thực tế...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
        <Link href="/instructor/courses" className="p-2 bg-[#1c1d1f] hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg border border-gray-800 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý nội dung khóa học</h1>
          <p className="text-gray-400 text-sm mt-1">Mã định danh khóa học: #{courseId}</p>
        </div>
      </div>

      <div className="bg-[#1c1d1f] rounded-xl border border-gray-800 p-6 md:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-white mb-6">Chương trình giảng dạy</h2>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-[#141517] border border-gray-700 rounded-lg overflow-hidden">
              
              <div className="bg-gray-800/50 px-5 py-4 flex items-center justify-between border-b border-gray-700">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <span className="text-gray-500">Chương {index + 1}:</span> {section.title}
                </h3>
              </div>

              <div className="p-4 space-y-2">
                {section.lessons && section.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between bg-[#1c1d1f] p-3 rounded border border-gray-800 hover:border-gray-600 transition-colors group">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                      <span className="text-gray-200 text-sm">{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                    {lesson.duration && Number(lesson.duration) > 0? (
                        <span className="text-xs text-gray-500 font-medium bg-gray-800 px-2 py-0.5 rounded">{formatTime(Number(lesson.duration))}</span>
                      ) : (
                        <span className="text-xs text-yellow-500 italic bg-yellow-500/10 px-2 py-0.5 rounded">Đang xử lý video...</span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Form thêm Bài học (Lesson) thuộc Chương này */}
                {activeSectionId === section.id ? (
                  <div className="mt-4 p-4 border border-dashed border-purple-500/50 rounded-lg bg-purple-500/5 space-y-3">
                    <input 
                      type="text" placeholder="Tên bài học (VD: Bài 1: Khởi tạo Project Spring Boot)" 
                      className="w-full bg-[#141517] border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-purple-500"
                      value={newLessonData.title} onChange={e => setNewLessonData({...newLessonData, title: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Đường dẫn YouTube (VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ)" 
                      className="w-full bg-[#141517] border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-purple-500"
                      value={newLessonData.youtubeUrl} onChange={e => setNewLessonData({...newLessonData, youtubeUrl: e.target.value})}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button onClick={() => setActiveSectionId(null)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white" disabled={isSubmitting}>Hủy</button>
                      <button onClick={() => handleAddLesson(section.id)} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded disabled:bg-purple-600/50" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang lưu...' : 'Lưu bài học'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveSectionId(section.id)}
                    className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 font-medium py-2 px-1 transition-colors mt-2"
                  >
                    + Thêm bài học
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Form thêm Chương (Section) mới */}
          {isAddingSection ? (
            <div className="bg-[#141517] border border-gray-700 rounded-lg p-5 flex items-center gap-3">
              <input 
                autoFocus
                type="text" 
                placeholder="Nhập tiêu đề chương mới và nhấn Enter..." 
                className="flex-1 bg-[#1c1d1f] border border-gray-700 text-white px-4 py-2.5 rounded focus:outline-none focus:border-purple-500"
                value={newSectionTitle}
                onChange={e => setNewSectionTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSection()}
                disabled={isSubmitting}
              />
              <button onClick={() => setIsAddingSection(false)} className="px-4 py-2.5 text-gray-400 hover:text-white text-sm font-semibold" disabled={isSubmitting}>Hủy</button>
              <button onClick={handleAddSection} className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded border border-gray-700 disabled:opacity-50" disabled={isSubmitting}>
                {isSubmitting ? 'Đang tạo...' : 'Thêm chương'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAddingSection(true)}
              className="w-full py-4 border-2 border-dashed border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/5 text-gray-400 hover:text-purple-400 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
            >
              + Thêm Chương Mới
            </button>
          )}

        </div>
      </div>
    </div>
  );
}