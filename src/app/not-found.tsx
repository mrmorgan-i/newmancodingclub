'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-hero-background">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div>
          <Image 
            src="/images/logo.svg" 
            alt="Newman Coding Club Logo" 
            width={64} 
            height={64} 
            className="mx-auto"
          />
        </div>

        {/* 404 Text */}
        <div>
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-3xl font-semibold text-foreground">Page Not Found</h2>
          <p className="mt-2 text-foreground-accent">Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        </div>
        
        {/* Code Block Decoration */}
        <div className="bg-white p-4 rounded-lg shadow-md text-left overflow-hidden">
          <pre className="text-sm text-gray-700">
            <code>{`// 404 Error detected
try {
  findPage("${typeof window !== 'undefined' ? window.location.pathname : ''}");
} catch (error) {
  console.error("404: Page not found");
  redirectToHomepage();
}`}</code>
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-accent transition-colors duration-300">
            <FaHome className="mr-2" /> Go to Homepage
          </Link>
          <button onClick={() => window.history.back()} className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-foreground bg-white hover:bg-gray-50 transition-colors duration-300">
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}