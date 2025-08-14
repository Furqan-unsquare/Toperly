import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Menu } from 'lucide-react';

const VirtualDevicesDashboard = () => {
  const [activeTab, setActiveTab] = useState('Languages');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Content data for different tabs
  const contentData = {
    Languages: {
      title: "Why Is Toperly Different",
      centralImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
      centralTitle: "Virtual Device Network",
      comments: [
        {
          id: 1,
          name: "Pablo Stanley",
          handle: "@pablostanley",
          message: "Vijay... you're one of the kindest, talented, and hard-working creatives I know. You're an inspiration and I'm grateful for your support. Thank you, Vijay.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
          verified: true,
        },
        {
          id: 2,
          name: "Martin Brown",
          handle: "@Martin_brit",
          message: "The virtual device integration is seamless and incredibly sophisticated.",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
          verified: false,
        }
      ],
      sideText: "The units behave like humans by monitoring the feed and liking what their behaviour type says they should like.",
      leftDescription: "All units operate from virtual android or even real devices that are indistinguishable from a real human device."
    },
    Skills: {
      title: "Foundation Network Operations",
      centralImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
      centralTitle: "NFT Foundation Hub",
      comments: [
        {
          id: 1,
          name: "Sarah Chen",
          handle: "@sarahchen",
          message: "The Foundation integration has revolutionized our NFT curation process. Absolutely incredible work!",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=50&h=50&fit=crop&crop=face",
          verified: true,
        },
        {
          id: 2,
          name: "Alex Thompson",
          handle: "@alexthompson",
          message: "Foundation units execute perfect bidding strategies automatically.",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
          verified: false,
        }
      ],
      sideText: "Foundation units manage sophisticated NFT transactions and community engagement seamlessly.",
      leftDescription: "Advanced AI systems handle foundation-based operations with human-like precision and decision making."
    },
    Community: {
      title: "AndroidVR Integration System",
      centralImage: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=300&fit=crop",
      centralTitle: "VR Experience Hub",
      comments: [
        {
          id: 1,
          name: "Emma Wilson",
          handle: "@emmawilson",
          message: "AndroidVR creates the most immersive experiences I've ever seen. The spatial awareness is incredible!",
          avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=50&h=50&fit=crop&crop=face",
          verified: true,
        },
        {
          id: 2,
          name: "Alex Thompson",
          handle: "@alexthompson",
          message: "Foundation units execute perfect bidding strategies automatically.",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
          verified: false,
        }
      ],
      sideText: "VR units create immersive virtual experiences with perfect spatial interaction management.",
      leftDescription: "Virtual reality interfaces powered by Android create seamless immersive user experiences."
    },
    more: {
      title: "Showtime Performance Hub",
      centralImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      centralTitle: "Live Performance Studio",
      comments: [
        {
          id: 1,
          name: "David Kim",
          handle: "@davidkim",
          message: "Showtime has transformed live streaming. The audience engagement analytics are phenomenal!",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
          verified: true,
        },
        {
          id: 2,
          name: "Alex Thompson",
          handle: "@alexthompson",
          message: "Foundation units execute perfect bidding strategies automatically.",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
          verified: false,
        }
      ],
      sideText: "Showtime units orchestrate live entertainment with advanced audience engagement systems.",
      leftDescription: "Entertainment-focused units manage live streams, performances, and real-time audience interaction."
    }
  };

  // Navigation tabs data - now constant
  const navTabs = [
    { name: "Languages", color: "bg-blue-500", id: "Languages" },
    { name: "Skills", color: "bg-purple-500", id: "Skills" },
    { name: "Community", color: "bg-pink-500", id: "Community" },
    { name: "Certificates & more", color: "bg-orange-500", id: "more" }
  ];

  const currentContent = contentData[activeTab];

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-200 to-purple-50 relative overflow-x-hidden">
      {/* Main Title */}
      <div className="text-center pt-16 md:pt-24 px-4 relative z-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 tracking-tight mb-8 md:mb-10">
          Why Is Toperly Different
        </h1>

        {/* Navigation Tags - now constant */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-0">
          {navTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-white text-xs md:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                tab.id === activeTab ? tab.color : 'bg-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className={`relative h-[800px] md:h-[600px] max-w-7xl mx-auto px-4 transition-all duration-500 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}>
        
        {/* Central Glass Container */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full md:w-auto px-4">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl w-full max-w-sm mx-auto md:w-96">
            {/* Title above image */}
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 text-center">
              {currentContent.centralTitle}
            </h3>
            
            {/* Central Image */}
            <div className="rounded-2xl overflow-hidden mb-4">
              <img 
                src={currentContent.centralImage} 
                alt={currentContent.centralTitle}
                className="w-full h-40 md:h-48 object-cover"
              />
            </div>

            {/* Stats */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-gray-700">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, doloribus!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left side description - hidden on mobile */}
        <div className="hidden md:block absolute top-1/3 left-4 transform -translate-y-1/2 max-w-xs">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
              {currentContent.leftDescription}
            </p>
          </div>
        </div>

        {/* Right side text - hidden on mobile */}
        <div className="hidden md:block absolute bottom-16 right-4 md:right-8 max-w-xs">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20">
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed text-right">
              {currentContent.sideText}
            </p>
          </div>
        </div>

        {/* Comments - positioned responsively */}
        <div className="absolute inset-0 pointer-events-none">
          {currentContent.comments.map((comment, index) => (
            <div 
              key={comment.id}
              className={`absolute z-50 w-48 md:w-60 ${
                index === 0 ? 'top-[30%] md:top-[55%] left-0 md:left-[17%]' : 
                'top-[60%] md:top-[25%] right-0 md:right-[17%]'
              }`}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/30 shadow-lg pointer-events-auto">
                <div className="flex items-start gap-2 md:gap-3">
                  <img 
                    src={comment.avatar}
                    alt={comment.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-1 md:gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-xs md:text-sm">{comment.name}</span>
                      {comment.verified && (
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 block mb-1 md:mb-2">{comment.handle}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mt-1">
                  {comment.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile side text - shown only on mobile */}
        <div className="md:hidden absolute bottom-8 left-4 right-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="text-gray-700 text-sm leading-relaxed">
              {currentContent.sideText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualDevicesDashboard;