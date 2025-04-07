'use client';

import { useEffect } from 'react';

export default function SlackRedirect() {
  
  useEffect(() => {
    // Redirect to the Slack invite
    window.location.href = 'https://join.slack.com/t/newman-coding-club/shared_invite/zt-32f7dfd3r-~ZoHuzue5NsycAC1Ll1B_Q';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Newman Coding Club</h1>
        <p className="mb-4">Redirecting you to our Slack workspace...</p>
        <div className="animate-pulse flex justify-center">
          <div className="h-4 w-32 bg-primary/30 rounded"></div>
        </div>
        <p className="mt-6 text-sm text-gray-600">
          If you are not redirected automatically, please click{' '}
          <a 
            href="https://join.slack.com/t/newman-coding-club/shared_invite/zt-32f7dfd3r-~ZoHuzue5NsycAC1Ll1B_Q" 
            className="text-primary hover:underline"
          >
            here
          </a>
        </p>
      </div>
    </div>
  );
}