'use client';

import Link from 'next/link';
import { FaArrowLeft, FaShare, FaPlay } from 'react-icons/fa';
import { useState } from 'react';

// Video data
const videos = [
  {
    id: "jq78rjyrqlue",
    title: "At The Hop Dance Break",
    embedUrl: "https://media.cm/e/jq78rjyrqlue"
  },
];

export default function ClearWaterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(0);
  
  const handleVideoChange = (index: number) => {
    setActiveVideo(index);
    setIsLoading(true);
  };
  
  return (
    <div className="min-h-screen bg-[#f9f9f9] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors">
            <FaArrowLeft className="mr-2" /> Back to Newman Coding Club
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Video Container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 flex-grow">
            {/* Video Player */}
            <div className="relative" style={{ paddingTop: "56.25%" /* 16:9 aspect ratio */ }}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <iframe 
                key={videos[activeVideo].id}
                src={videos[activeVideo].embedUrl} 
                frameBorder="0" 
                allowFullScreen 
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%"
                }}
                onLoad={() => setIsLoading(false)}
              />
            </div>
            
            {/* Video Info */}
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">{videos[activeVideo].title}</h1>
              <div className="flex justify-between items-center">
                <p className="text-foreground-accent text-sm">ClearWater Dance Videos</p>
                <button 
                  className="flex items-center text-sm text-foreground-accent hover:text-primary"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${videos[activeVideo].title} - Newman University Chorale`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                >
                  <FaShare className="mr-2" /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Playlist Sidebar (on mobile, appears below the video) */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden md:w-72">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold">ClearWater Dances Playlist</h2>
            </div>
            <div className="overflow-y-auto max-h-96">
              {videos.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoChange(index)}
                  className={`w-full text-left p-4 hover:bg-gray-50 border-b flex items-start gap-3 ${activeVideo === index ? 'bg-gray-100' : ''}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {activeVideo === index ? (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <FaPlay className="text-white w-3 h-3 ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${activeVideo === index ? 'text-primary' : 'text-foreground'}`}>
                      {video.title}
                    </p>
                    <p className="text-xs text-foreground-accent">ClearWater Dance Videos</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">About this performance</h2>
          <p className="text-foreground-accent mb-4">
            Watch Deanne perform each dance and practice! These videos are hosted by the Newman Coding Club as part of our campus collaboration initiatives.
          </p>
          {/* <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-foreground-accent">
              This page is maintained by the <Link href="/" className="text-primary hover:underline">Newman Coding Club</Link>. 
              For more videos, check back soon or join our club to learn how we built this page!
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}