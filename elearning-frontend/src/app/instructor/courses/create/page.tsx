'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { courseService } from '@/services/courseService';

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // State quản lý form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '1', // Mặc định là 1 (Lập trình Backend)
    imageUrl: '',
    language: 'Tiếng Việt',
  });

  // Xử lý khi user gõ vào form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Lấy ID giảng viên từ localStorage (Zustand auth-storage)
      const storageStr = localStorage.getItem('auth-storage');
      let instructorId = null;
      if (storageStr) {
        const parsed = JSON.parse(storageStr);
        instructorId = parsed?.state?.user?.id;
      }

      // Đóng gói dữ liệu gửi lên Backend
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        imageUrl: formData.imageUrl,
        language: formData.language,
        instructorId: instructorId, // Chuyền ID giảng viên vào
        status: 'DRAFT', // Khóa học mới tạo mặc định nằm ở bản nháp
      };

      await courseService.createCourse(payload);
      alert('🎉 Tạo khóa học bản nháp thành công!');
      router.push('/instructor/courses'); // Trở về danh sách
      
    } catch (error) {
      console.error('Lỗi tạo khóa học:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Nút quay lại & Tiêu đề */}
      <div className="flex items-center gap-4">
        <Link href="/instructor/courses" className="p-2 bg-[#1c1d1f] hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg border border-gray-800 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Tạo khóa học mới</h1>
          <p className="text-gray-400 text-sm mt-1">Bắt đầu hành trình chia sẻ tri thức của bạn.</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-[#1c1d1f] rounded-xl border border-gray-800 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Cột trái: Thông tin cơ bản */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Tên khóa học <span className="text-red-500">*</span></label>
              <input 
                type="text" name="title" required
                value={formData.title} onChange={handleChange}
                placeholder="VD: Làm chủ ReactJS trong 30 ngày..."
                className="w-full bg-[#141517] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Giá tiền (VNĐ) <span className="text-red-500">*</span></label>
              <input 
                type="number" name="price" required min="0"
                value={formData.price} onChange={handleChange}
                placeholder="VD: 599000"
                className="w-full bg-[#141517] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Danh mục</label>
                <select 
                  name="categoryId" value={formData.categoryId} onChange={handleChange}
                  className="w-full bg-[#141517] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-all"
                >
                  <option value="1">Lập trình Backend</option>
                  <option value="2">Lập trình Frontend</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Ngôn ngữ</label>
                <select 
                  name="language" value={formData.language} onChange={handleChange}
                  className="w-full bg-[#141517] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-all"
                >
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cột phải: Mô tả & Hình ảnh */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Mô tả khóa học</label>
              <textarea 
                name="description" rows={4}
                value={formData.description} onChange={handleChange}
                placeholder="Khóa học này sẽ giúp học viên..."
                className="w-full bg-[#141517] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-all resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Link ảnh bìa (Image URL)</label>
              <input 
                type="text" name="imageUrl"
                value={formData.imageUrl} onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-[#141517] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-all mb-3"
              />
              {/* Preview ảnh nhỏ nếu có link */}
              {formData.imageUrl && (
                <div className="w-full h-32 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end gap-4">
          <Link href="/instructor/courses" className="px-6 py-2.5 text-gray-400 hover:text-white font-semibold transition-colors">
            Hủy bỏ
          </Link>
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-bold rounded-lg transition-colors shadow-md flex items-center gap-2"
          >
            {isLoading ? 'Đang tạo...' : 'Tạo bản nháp'}
          </button>
        </div>
      </form>
    </div>
  );
}