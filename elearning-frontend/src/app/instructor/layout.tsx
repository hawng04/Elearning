'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

// Danh sách các menu chức năng của Giảng viên
const MENU_ITEMS = [
  { name: 'Tổng quan', href: '/instructor', icon: '📊' },
  { name: 'Khóa học của tôi', href: '/instructor/courses', icon: '📚' },
  { name: 'Thảo luận (Chat)', href: '/instructor/chat', icon: '💬' },
  { name: 'Doanh thu', href: '/instructor/revenue', icon: '💰' },
  { name: 'Cài đặt', href: '/instructor/settings', icon: '⚙️' },
];

interface UserSession {
  fullName?: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
}

export default function InstructorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // State lưu trữ user thật lấy từ localStorage
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    // Lấy đúng tên key là 'auth-storage'
    const storageStr = localStorage.getItem('auth-storage');
    if (storageStr) {
      try {
        const parsed = JSON.parse(storageStr);
        // Trỏ đúng vào đường dẫn lồng nhau của Zustand
        const userData = parsed?.state?.user; 
        
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Lỗi đọc storage:", error);
      }
    }
  }, []);

  // Lấy tên hiển thị, linh hoạt theo mọi trường hợp dữ liệu
  const displayName = user?.fullName || user?.name || 'Giảng viên';
  
  // Tạo ký tự viết tắt cho Avatar (Ví dụ: c -> C)
  const avatarFallback = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-[#141517] text-gray-100 overflow-hidden">
      
      {/* SIDEBAR CỐ ĐỊNH BÊN TRÁI */}
      <aside className="w-64 bg-[#1c1d1f] border-r border-gray-800 flex flex-col">
        {/* Logo / Branding */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link href="/" className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm">GV</span>
            E-Learning
          </Link>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
            Quản lý giảng dạy
          </p>
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-600/10 text-purple-400 font-semibold border border-purple-500/20' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* USER INFO THẬT Ở ĐÁY SIDEBAR */}
        <div className="p-4 border-t border-gray-800 flex items-center gap-3 bg-[#17181a]">
          {user?.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={displayName} 
              className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
              {avatarFallback}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate" title={displayName}>
              {displayName}
            </p>
            <p className="text-xs text-purple-400 font-medium truncate capitalize">
              {user?.role?.toLowerCase() || 'instructor'}
            </p>
          </div>
        </div>
      </aside>

      {/* KHU VỰC NỘI DUNG CHÍNH (ĐỘNG) */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Nhỏ (Top bar) */}
        <header className="h-16 bg-[#1c1d1f] border-b border-gray-800 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-semibold text-white capitalize">
            {MENU_ITEMS.find(item => item.href === pathname)?.name || 'Dashboard'}
          </h2>
          
        </header>

        {/* Vùng hiển thị các trang con (page.tsx) */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>

    </div>
  );
}