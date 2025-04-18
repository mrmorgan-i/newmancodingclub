'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaInstagram, FaDiscord, FaSlack, FaUsers } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
// import X logo


export default function Links() {
  // Define all the links
  const links = [
    {
      name: 'GroupMe',
      url: '/groupme',
      icon: <FaUsers className="w-6 h-6" />,
      description: 'Join our main communication channel'
    },
    {
      name: 'Instagram',
      url: '/instagram',
      icon: <FaInstagram className="w-6 h-6" />,
      description: 'Follow us for event photos and updates'
    },
    {
      name: 'GitHub',
      url: '/github',
      icon: <FaGithub className="w-6 h-6" />,
      description: 'Check out our projects and code'
    },
    {
      name: 'Discord',
      url: '/discord',
      icon: <FaDiscord className="w-6 h-6" />,
      description: 'Join our developer community'
    },
    {
      name: 'Slack',
      url: '/slack',
      icon: <FaSlack className="w-6 h-6" />,
      description: 'Collaborate on projects and discussions'
    },
    {
      name: 'X (Twitter)',
      url: '/x',
      icon: <FaXTwitter className="w-6 h-6" />,
      description: 'Follow us for Twitter-Style updates',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-hero-background py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src="/images/logo.svg" 
              alt="Newman Coding Club Logo" 
              width={80} 
              height={80}
              className="mx-auto" 
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Newman Coding Club</h1>
          <p className="mt-2 text-foreground-accent">Connect with us on our platforms</p>
        </div>
        
        {/* Links List */}
        <div className="space-y-3">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.url}
              className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary mr-4">
                {link.icon}
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{link.name}</h2>
                <p className="text-sm text-foreground-accent">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-10">
          <Link 
            href="/"
            className="text-primary hover:underline"
          >
            Return to Homepage
          </Link>
          <p className="mt-4 text-sm text-foreground-accent">
            &copy; {new Date().getFullYear()} Newman Coding Club
          </p>
        </div>
      </div>
    </div>
  );
}