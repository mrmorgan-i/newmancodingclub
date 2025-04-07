'use client';

import { useEffect } from 'react';

export default function DiscordRedirect() {
  
  useEffect(() => {
    // Redirect to the Discord invite
    window.location.href = 'https://discord.gg/b8whUeKn';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Newman Coding Club</h1>
        <p className="mb-4">Redirecting you to our Discord server...</p>
        <div className="animate-pulse flex justify-center">
          <div className="h-4 w-32 bg-primary/30 rounded"></div>
        </div>
        <p className="mt-6 text-sm text-gray-600">
          If you are not redirected automatically, please click{' '}
          <a 
            href="https://discord.gg/b8whUeKn" 
            className="text-primary hover:underline"
          >
            here
          </a>
        </p>
      </div>
    </div>
  );
}