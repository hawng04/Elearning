'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axiosClient from '@/lib/axiosClient';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/useAuthStore';

const UDEMY_PURPLE = '#a435f0';

export default function INSTRUCTORRegistrationPage() {
  const router = useRouter();
  const loginFn = useAuthStore((state) => state.login);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!fullName.trim() || !email.includes('@') || password.length < 6) {
        setError('Vui lòng điền đầy đủ thông tin hợp lệ (Mật khẩu >= 6 ký tự)!');
        setIsLoading(false);
        return;
    }

    if (password !== confirmPassword) {
        setError('Mật khẩu và xác nhận mật khẩu không khớp!');
        setIsLoading(false);
        return;
    }

    try {
      const response = await axiosClient.post('/auth/register', {
        fullName,
        email,
        password,
        role: 'INSTRUCTOR', 
      });

      const token = response.data?.token || response.data;
      
      if (typeof token === 'string' && token.startsWith('eyJ')) {
        const user = response.data?.user || { id: 0, email, fullName, role: 'INSTRUCTOR' };
        loginFn(user, token);
        router.push('/'); 
      } else {
        alert('Đăng ký Giảng viên thành công! Vui lòng đăng nhập.');
        router.push('/login');
      }
      
    } catch (err: any) {
      setError(err.response?.data || 'Đăng ký thất bại. Email này có thể đã được sử dụng!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow flex bg-white">
        
        {/* Phần bên trái: Hình ảnh minh họa Giảng viên */}
        <div className="hidden md:flex flex-1 items-center justify-center p-12 border-r border-gray-100">
          <Image
            src="/images/learning-management-system.webp" // Bạn có thể thay bằng ảnh Giảng viên của bạn
            alt="Teach on Udemy Illustration"
            width={600}
            height={600}
            className="w-full max-w-lg h-auto"
          />
        </div>

        {/* Phần bên phải: Biểu mẫu đăng ký Giảng viên */}
        <div className="flex flex-1 w-full md:w-1/2 items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-lg space-y-6">
            
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Trở thành Giảng viên Udemy
            </h1>
            
            <p className="text-gray-700 text-lg">
                Khám phá cộng đồng hỗ trợ bao gồm nhiều giảng viên online. Được phép sử dụng ngay tất cả các tài nguyên sáng tạo khóa học.
            </p>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            <form className="space-y-5 pt-4" onSubmit={handleRegister}>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-900">Tên đầy đủ</label>
                  <input
                    type="text"
                    required
                    className="block w-full border border-gray-900 px-4 py-4 focus:border-blue-600 focus:outline-none focus:ring-0"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-900">Email</label>
                  <input
                    type="email"
                    required
                    className="block w-full border border-gray-900 px-4 py-4 focus:border-blue-600 focus:outline-none focus:ring-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-900">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    className="block w-full border border-gray-900 px-4 py-4 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-900">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    required
                    className="block w-full border border-gray-900 px-4 py-4 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                {/* Checkbox đặc trưng của Udemy */}
                <div className="flex items-start gap-3 pt-2">
                    <input type="checkbox" id="promo" className="mt-1 w-5 h-5 cursor-pointer accent-purple-600 border-gray-900" />
                    <label htmlFor="promo" className="text-sm text-gray-700 cursor-pointer">
                        Tôi muốn tận dụng tối đa trải nghiệm của mình bằng cách nhận email có bí quyết của người trong ngành, động lực, nội dung cập nhật đặc biệt và chương trình quảng cáo chỉ dành cho giảng viên.
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center px-6 py-4 text-lg font-bold text-white disabled:bg-purple-300 transition-colors hover:bg-purple-700 mt-4"
                    style={{ backgroundColor: UDEMY_PURPLE }}
                >
                    {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
                </button>

                {/* Các tùy chọn khác */}
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-6">
                    <div className="border-t flex-grow border-gray-300"></div>
                    <span className="text-sm">Các tùy chọn đăng ký khác</span>
                    <div className="border-t flex-grow border-gray-300"></div>
                </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}