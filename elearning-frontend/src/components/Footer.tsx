import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="flex flex-col space-y-3 text-sm">
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Udemy Business</Link>
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Giảng dạy trên Udemy</Link>
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Tải ứng dụng</Link>
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Giới thiệu</Link>
        </div>
        
        <div className="flex flex-col space-y-3 text-sm">
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Nghề nghiệp</Link>
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Blog</Link>
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Trợ giúp và Hỗ trợ</Link>
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Đơn vị liên kết</Link>
        </div>

        <div className="flex flex-col space-y-3 text-sm">
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Điều khoản</Link>
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Chính sách bảo mật</Link>
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Cài đặt cookie</Link>
          <Link href="#" className="hover:underline text-gray-300 hover:text-white">Sơ đồ trang web</Link>
        </div>

        
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
        
        <div className="text-sm text-gray-400">
          © 2026 - Thanh Hằng
        </div>
      </div>
    </footer>
  );
}