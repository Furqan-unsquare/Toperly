import React, { useState, useEffect } from 'react';

const AIRepresentativesUI = () => {
  const [isClient, setIsClient] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [currentCenterImage, setCurrentCenterImage] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Center images that change on floating circle clicks
  const centerImages = [
    "/certificate.jpg",
    "/certificate1.jpg",
    "/certificate2.jpg",    
    "/certificate3.jpg",
    "/certificate2.jpg"
  ];

  // Enhanced profile configuration
  const profiles = {
    desktop: [
      {
        id: 1,
        src: "https://randomuser.me/api/portraits/women/44.jpg",
        name: "AI Sarah",
        role: "Content Creator",
        size: "w-20 h-20",
        position: "left-96 top-20",
        bg: "bg-gradient-to-r from-blue-100 to-purple-100",
        zIndex: "z-20",
        aiGlow: "shadow-blue-400/50",
        pathColor: "stroke-blue-400"
      },
      {
        id: 2,
        src: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "AI Marcus",
        role: "Brand Ambassador",
        size: "w-24 h-24",
        position: "left-1/4 -ml-16 bottom-64",
        bg: "bg-gradient-to-r from-green-100 to-emerald-100",
        zIndex: "z-20",
        aiGlow: "shadow-green-400/50",
        pathColor: "stroke-green-400"
      },
      {
        id: 3,
        src: "https://randomuser.me/api/portraits/women/68.jpg",
        name: "AI Emma",
        role: "Product Specialist",
        size: "w-16 h-16",
        position: "right-40 top-72",
        bg: "bg-gradient-to-r from-pink-100 to-rose-100",
        zIndex: "z-20",
        aiGlow: "shadow-pink-400/50",
        pathColor: "stroke-pink-400"
      },
      {
        id: 4,
        src: "https://randomuser.me/api/portraits/men/75.jpg",
        name: "AI David",
        role: "Engagement Manager",
        size: "w-17 h-17",
        position: "right-40 top-36",
        bg: "bg-gradient-to-r from-orange-100 to-yellow-100",
        zIndex: "z-20",
        aiGlow: "shadow-orange-400/50",
        pathColor: "stroke-orange-400"
      },
      {
        id: 5,
        src: "https://randomuser.me/api/portraits/women/63.jpg",
        name: "AI Luna",
        role: "Community Builder",
        size: "w-15 h-15",
        position: "left-1/4 -ml-6 bottom-40",
        bg: "bg-gradient-to-r from-violet-100 to-purple-100",
        zIndex: "z-20",
        aiGlow: "shadow-violet-400/50",
        pathColor: "stroke-violet-400"
      },
      {
        id: 6,
        src: "https://randomuser.me/api/portraits/women/81.jpg",
        name: "AI Zoe",
        role: "Trend Analyst",
        size: "w-16 h-16",
        position: "right-1/4 bottom-28",
        bg: "bg-gradient-to-r from-teal-100 to-cyan-100",
        zIndex: "z-20",
        aiGlow: "shadow-teal-400/50",
        pathColor: "stroke-teal-400"
      }
    ]
  };

  const handleFloatingCircleClick = (profileId) => {
    setClickCount(prev => prev + 1);
    setCurrentCenterImage(prev => (prev + 1) % centerImages.length);
  };

  const AIOrb = ({ profile, index }) => (
    <div className={`absolute ${profile.position} ${profile.zIndex} transform transition-all duration-1000 ease-in-out cursor-pointer`}>      
      {/* Main Profile Image */}
      <img 
        src={profile.src} 
        alt={profile.name} 
        className={`${profile.size} rounded-full shadow-xl object-cover transition-all duration-300 hover:scale-110 hover:shadow-2xl`}
        onMouseEnter={() => setHoveredProfile(profile.id)}
        onMouseLeave={() => setHoveredProfile(null)}
        onClick={() => handleFloatingCircleClick(profile.id)}
      />
      
      {/* Hover Card */}
      {hoveredProfile === profile.id && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl p-3 min-w-max z-40 border border-gray-200">
          <div className="text-sm font-semibold text-gray-800">{profile.name}</div>
          <div className="text-xs text-gray-500">{profile.role}</div>
          <div className="flex items-center mt-2">
            <span className="text-xs text-green-600">Active</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-200 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Left Text */}
      <div className="absolute top-56 left-16 z-10">
       <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
          At Toperly, we believe your background shouldn’t be a barrier to your future. That’s why we built
a platform with four core principles:
        </p>
      </div>

      {/* Top Right Text */}
      <div className="absolute bottom-96 right-8 z-10">
         <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
          Other platforms teach AI like a foreign language. <br />
          We teach it like your native one
        </p>
      </div>

      {/* Bottom Right Marquee with blur edges */}
      <div className="absolute bottom-80 right-8 z-5  overflow-hidden">
        <div className="">
          {/* Blur gradients on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
          
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="mx-4 text-sm text-gray-600">MANUAL</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">SKIPMORT</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">LOGO</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">MANUAL</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">SKIPMORT</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">LOGO</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">MANUAL</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">SKIPMORT</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">LOGO</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">MANUAL</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">SKIPMORT</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
            <span className="mx-4 text-sm text-gray-600">LOGO</span>
            <span className="mx-4 text-sm text-gray-600">•</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative px-4 py-12 sm:px-6 sm:py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light text-gray-800 tracking-tight">
            Why Is Toperly Different
          </h1>
        </div>

        {/* Interactive AI Network */}
        <div className="relative max-w-7xl mx-auto h-[600px] sm:h-[800px]">
          {/* AI Representatives Orbs */}
          {profiles.desktop.map((profile, index) => (
            <AIOrb key={profile.id} profile={profile} index={index} />
          ))}

          {/* Background Ball behind post */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2  z-0">
            <div className="w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
          </div>

          {/* Central Command Hub with blur overlay */}
          <div className="absolute  left-1/2 bottom-0 transform -translate-x-1/2 -translate-y-1/2 z-20">
            {/* Blur overlay */}
            <div className="absolute inset-0 backdrop-blur-3xl bg-white/10 rounded-3xl z-10"></div>
            
            {/* Main Hub */}
            <div className="relative bg-white/90 rounded-3xl shadow-2xl border border-gray-200 backdrop-blur-sm z-20">
              {/* Sample Post Interface */}
              <div className="w-80 sm:w-96">
                <div className="flex items-center mb-3 px-4 pt-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/65.jpg" 
                    alt="AI Jessica" 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-sm">Jessica Bo</span>
                      <span className="ml-2 text-blue-500">✓</span>
                    </div>
                    <span className="text-xs text-gray-500">Paris, France</span>
                  </div>
                </div>
                <div className="transition-all duration-500 ease-in-out">
                  <img 
                    key={currentCenterImage}
                    src={centerImages[currentCenterImage]} 
                    alt="Content" 
                    className="w-full h-96 object-cover animate-fadeIn"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Indicators */}
          <div className="absolute left-1/4 top-8 z-15">
            <div className="bg-white/80 backdrop-blur-lg rounded-lg p-3 shadow-lg border border-gray-200 ">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-sm">❤️</span>
                </div>
                <span className="text-xs text-gray-700">Like posts by your representatives</span>
              </div>
            </div>
          </div>

          <div className="absolute right-1/4 top-36 z-15">
            <div className="bg-white/80 backdrop-blur-lg rounded-lg p-3 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-500 text-sm">✨</span>
                </div>
                <span className="text-xs text-gray-700">dvertising</span>
              </div>
            </div>
          </div>

          {/* Product Promotion Card */}
          <div className="absolute left-3/4 bottom-28 transform -translate-x-1/2 z-15">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🔄</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">Repost products to increase sales</div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-2">1367 Posts</span>
                  <div className="flex -space-x-1">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-5 h-5 rounded-full border border-white" alt="" />
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-5 h-5 rounded-full border border-white" alt="" />
                    <img src="https://randomuser.me/api/portraits/women/68.jpg" className="w-5 h-5 rounded-full border border-white" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AIRepresentativesUI;
