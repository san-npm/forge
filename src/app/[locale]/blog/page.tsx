'use client';

import { useRouter } from 'next/navigation';
import PageNavbar from '@/components/PageNavbar';
import Footer from '@/components/Footer';
import Blog from '@/components/Blog';
import { BreadcrumbJsonLd, useBreadcrumbs } from '@/components/BreadcrumbJsonLd';

export default function BlogPage() {
  const router = useRouter();
  const breadcrumbItems = useBreadcrumbs();

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="min-h-screen flex flex-col bg-white">
        <PageNavbar />
        <div className="flex-1">
          <Blog onBack={() => router.push('/')} />
        </div>
        <Footer />
      </div>
    </>
  );
}
