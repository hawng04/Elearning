'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axiosClient from '@/lib/axiosClient';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/useAuthStore';

// Mã màu tím đặc trưng của Udemy
const UDEMY_PURPLE = '#a435f0';

export default function RegisterPage() {
  const router = useRouter();
  const loginFn = useAuthStore((state) => state.login);
  
  // Quản lý các trường thông tin đăng ký
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý khi nhấn nút "Đăng ký"
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate cơ bản ở Frontend
    if (!fullName.trim()) {
        setError('Vui lòng nhập họ và tên của bạn!');
        setIsLoading(false);
        return;
    }

    if (!email || !email.includes('@')) {
        setError('Vui lòng nhập một email hợp lệ!');
        setIsLoading(false);
        return;
    }

    if (!password || password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự!');
        setIsLoading(false);
        return;
    }

    if (password !== confirmPassword) {
        setError('Mật khẩu và xác nhận mật khẩu không khớp!');
        setIsLoading(false);
        return;
    }

    

    try {
      // Gọi API đăng ký (Gửi toàn bộ thông tin trong 1 lần)
      const response = await axiosClient.post('/auth/register', {
        fullName,
        email,
        password,
        role: 'STUDENT' // Gửi kèm role mặc định nếu Backend yêu cầu
      });

      // Tùy thuộc vào việc Backend của bạn trả về Token ngay sau khi đăng ký 
      // hay chỉ trả về thông báo thành công.
      const token = response.data?.token || response.data;
      
      if (typeof token === 'string' && token.startsWith('eyJ')) {
        const user = response.data?.user || { id: 0, email, fullName, role: 'STUDENT' };
        loginFn(user, token);
        router.push('/');
      } else {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
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

      <main className="flex-grow flex bg-white">
        
        {/* Phần bên trái: Hình ảnh minh họa */}
        <div className="hidden md:flex flex-1 items-center justify-center p-12">
          <Image
            src="/images/learning-management-system.webp" 
            alt="Register Illustration"
            width={1000}
            height={1000}
            className="w-full max-w-lg h-auto"
          />
        </div>

        {/* Phần bên phải: Biểu mẫu đăng ký */}
        <div className="flex flex-1 w-full md:w-1/2 items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-lg space-y-8">
            
            <h1 className="text-4xl font-bold text-center tracking-tight text-gray-900 leading-tight mb-2">
                Đăng ký và bắt đầu học tập
            </h1>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            <form className="space-y-5" onSubmit={handleRegister}>
                
                {/* Ô nhập Họ và Tên */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded-lg border border-gray-900 px-5 py-3.5 focus:border-blue-600 focus:outline-none focus:ring-0 text-lg"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* Ô nhập Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="block w-full rounded-lg border border-gray-900 px-5 py-3.5 focus:border-blue-600 focus:outline-none focus:ring-0 text-lg"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Ô nhập Mật khẩu */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    className="block w-full rounded-lg border border-gray-900 px-5 py-3.5 focus:border-blue-600 focus:outline-none focus:ring-0 text-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    required
                    className="block w-full rounded-lg border border-gray-900 px-5 py-3.5 focus:border-blue-600 focus:outline-none focus:ring-0 text-lg"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center rounded-lg px-6 py-4 text-lg font-semibold text-white shadow-sm disabled:bg-purple-300 transition-colors hover:bg-purple-700 mt-2"
                    style={{ backgroundColor: UDEMY_PURPLE }}
                >
                    {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
                
                <p className="text-center text-sm text-gray-700 mt-6 space-y-2">
                  Bằng việc đăng ký, bạn đồng ý với{' '}
                  <Link href="#" className="font-semibold hover:underline" style={{ color: UDEMY_PURPLE }}>
                    Điều khoản sử dụng
                  </Link>
                  {' '}và{' '}
                  <Link href="#" className="font-semibold hover:underline" style={{ color: UDEMY_PURPLE }}>
                    Chính sách bảo mật
                  </Link>
                  {' '}của chúng tôi.
                </p>

                <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-200 mt-6">
                    <p className="text-center text-sm text-gray-700 mt-4">
                      Bạn đã có tài khoản?{' '}
                      <Link href="/login" className="font-semibold hover:underline" style={{ color: UDEMY_PURPLE }}>
                        Đăng nhập
                      </Link>
                    </p>
                </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}