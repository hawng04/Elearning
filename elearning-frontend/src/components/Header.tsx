'use client';

import Link from 'next/link';
import { ShoppingCart, Globe, Search, LogOut } from 'lucide-react';

export default function Header() {

  const {isAuthenticated, user, logout} = useAuthStore();
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6 shadow-sm">
      <Link href="/" className="flex-shrink-0">
        <Image
            src="/images/logo-udemy.svg" 
            alt="Udemy Logo"
            width={80}
            height={40}
            priority
        />
      </Link>

      <div className="flex items-center gap-4 text-sm text-gray-700 hidden md:flex">
        <Link href="#" className="hover:text-blue-600">Khám phá</Link>
        <Link href="/teaching" className="hover:text-blue-600">Giảng dạy trên Udemy</Link>
      </div>

      <div className="flex-grow flex-shrink min-w-[300px] relative">
        <input
          type="text"
          placeholder="Tìm kiếm nội dung bất kỳ"
          className="w-full border border-gray-900 px-12 py-3 rounded-full text-sm focus:border-blue-600 focus:outline-none focus:ring-0"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 h-5 w-5" />
      </div>

      <div className="flex items-center gap-3 text-sm flex-shrink-0 ml-auto">
        <Link href="#" className="text-gray-700 hover:text-blue-600 hidden md:flex transition-colors">Udemy Business</Link>
        {/* <button className="text-gray-900 hover:text-blue-600 transition-colors">
          <ShoppingCart className="h-5 w-5" />
        </button> */}

        {/* LOGIC HIỂN THỊ ĐỘNG */}
        {isAuthenticated ? (
          // NẾU ĐÃ ĐĂNG NHẬP: Hiện Avatar và Dropdown/Logout
          <div className="flex items-center gap-4 ml-2">
            <Link href="/my-courses" className="font-semibold text-gray-700 hover:text-purple-600">
              Học tập của tôi
            </Link>
            <div className="h-10 w-10 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold">
              {/* Lấy chữ cái đầu của tên làm Avatar */}
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors" title="Đăng xuất">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          // NẾU CHƯA ĐĂNG NHẬP: Hiện 2 nút mặc định
          <>
            <Link href="/login" className="border border-gray-900 text-gray-900 px-5 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors">
              Đăng nhập
            </Link>
            <Link href="/register" className="bg-gray-900 text-white px-5 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors">
              Đăng ký
            </Link>
          </>
        )}

        <button className="border border-gray-900 text-gray-900 px-4 py-3 rounded-md hover:bg-gray-50 transition-colors ml-2">
          <Globe className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
