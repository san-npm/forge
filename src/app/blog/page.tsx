'use client'

import { useRouter } from 'next/navigation'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'
import Blog from '@/components/Blog'

export default function BlogPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageNavbar />
      <div className="flex-1">
        <Blog onBack={() => router.push('/')} />
      </div>
      <Footer />
    </div>
  )
}
