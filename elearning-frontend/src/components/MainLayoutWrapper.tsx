'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header'; // Điều chỉnh đường dẫn nếu cần
import Footer from '@/components/Footer'; // Điều chỉnh đường dẫn nếu cần

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLearningPage = pathname?.startsWith('/learning');
  
  const hideHeaderFooter = isLearningPage; 

  return (
    <>
      {!hideHeaderFooter && <Header />}
      
      <main className="flex-grow">
        {children}
      </main>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}