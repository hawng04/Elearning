'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axiosClient from '@/lib/axiosClient';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/useAuthStore';

const UDEMY_PURPLE = '#a435f0';

export default function LoginPage() {
  const router = useRouter();
  
  const loginFn = useAuthStore((state) => state.login);
  
  // Chỉ cần quản lý các state cơ bản này, bỏ state "step"
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate nhanh ở Frontend
    if (!email || !email.includes('@')) {
        setError('Vui lòng nhập một email hợp lệ!');
        setIsLoading(false);
        return;
    }

    if (!password) {
        setError('Vui lòng nhập mật khẩu!');
        setIsLoading(false);
        return;
    }

    try {
      const response = await axiosClient.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      
      if (token) {
        loginFn(user, token); 
        router.push('/');     
      }
    } catch (err: any) {
      setError(err.response?.data || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <main className="flex-grow flex bg-white">
        
        {/* Phần ảnh minh họa bên trái */}
        <div className="hidden md:flex flex-1 items-center justify-center p-12">
          <Image
            src="/images/learning-management-system.webp" 
            alt="Login Illustration"
            width={1000}
            height={1000}
            className="w-full max-w-lg h-auto"
          />
        </div>

        {/* Phần form đăng nhập bên phải */}
        <div className="flex flex-1 w-full md:w-1/2 items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-lg space-y-8">
            
            <h1 className="text-4xl font-bold text-center tracking-tight text-gray-900 leading-tight mb-2">
                Đăng nhập để tiếp tục hành trình học tập của bạn
            </h1>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
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
                
                {/* Nút Đăng nhập */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center rounded-lg px-6 py-4 text-lg font-semibold text-white shadow-sm disabled:bg-purple-300 transition-colors hover:bg-purple-700 mt-2"
                    style={{ backgroundColor: UDEMY_PURPLE }}
                >
                    {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
                
                {/* Phần Social Login */}
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-4">
                    <div className="border-t flex-grow border-gray-300"></div>
                    <span className="text-sm">Các tùy chọn đăng nhập khác</span>
                    <div className="border-t flex-grow border-gray-300"></div>
                </div>

                <div className="flex gap-4 justify-center pt-2">
                    {[
                        { name: 'Google', icon: 'https://www.udemy.com/static/images/v7/logo-google.svg' },
                        { name: 'Facebook', icon: 'https://www.udemy.com/static/images/v7/logo-facebook.svg' },
                        { name: 'Apple', icon: 'https://www.udemy.com/static/images/v7/logo-apple.svg' },
                    ].map(platform => (
                        <button key={platform.name} type="button" className="border border-gray-900 p-4 rounded-full hover:bg-gray-50 transition-colors">
                            <Image src={platform.icon} alt={platform.name} width={28} height={28} />
                        </button>
                    ))}
                </div>
                
                {/* Các liên kết phụ trợ */}
                <div className="flex flex-col items-center gap-3 pt-4">
                    <p className="text-center text-sm text-gray-700">
                      Bạn không có tài khoản?{' '}
                      <Link href="/register" className="font-semibold hover:underline" style={{ color: UDEMY_PURPLE }}>
                        Đăng ký ngay
                      </Link>
                    </p>
                    <Link href="#" className="text-sm font-semibold hover:underline" style={{ color: UDEMY_PURPLE }}>
                      Quên mật khẩu?
                    </Link>
                </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}