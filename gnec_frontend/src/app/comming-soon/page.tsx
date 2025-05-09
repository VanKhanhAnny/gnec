'use client'

import React from 'react'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-800 px-4 -mt-15">
      <div className="text-center max-w-md">
        <h1 className="lg:text-6xl text-4xl font-extrabold text-gray-800 mb-4">
          Coming Soon
        </h1>
        <p className="lg:text-xl text-md text-gray-200">
          We’re building this feature now and it will be available soon. 
          Thanks for your patience!
        </p>
        <p className="text-gray-200 text-sm mt-6">
          © {new Date().getFullYear()} Sign1o. All rights reserved.
        </p>
      </div>
    </div>
  )
}
