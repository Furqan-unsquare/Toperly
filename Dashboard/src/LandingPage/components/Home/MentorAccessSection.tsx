import React, { useState, useEffect, useRef } from 'react';

// Custom hook for intersection observer
const useInView = (threshold = 0.1, rootMargin = '0px') => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Stop observing after first trigger
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return [ref, isInView];
};

// Profile Card Component
const ProfileCard = ({ 
  name, 
  role, 
  image, 
  size = 'md', 
  position = { top: '50%', left: '50%' },
  delay = 0,
  isVisible = false 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 scale-100 rotate-0' 
          : 'opacity-0 scale-50 rotate-180'
      }`}
      style={{ 
        top: position.top, 
        left: position.left,
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="relative group cursor-pointer">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-3 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}>
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <div className="font-medium">{name}</div>
          <div className="text-gray-300">{role}</div>
        </div>
      </div>
    </div>
  );
};


// Central Post Component
const CentralPost = ({ isVisible, delay = 0 }) => {
  return (
    <div
      className={`absolute mt-0 md:mt-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-90 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}>
      <div className="bg-white rounded-2xl shadow-xl w-72 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <img src="https://i.pinimg.com/736x/65/d2/93/65d293150279b6edf041aeb40652cb82.jpg" className='rounded-t-2xl shadow' alt="" />
        {/* Header */}
        <div className='p-4'>
          
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Career Mentor</div>
            <div className="text-sm text-gray-500">Available now</div>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="text-gray-600 text-sm">
            Get personalized guidance on interview prep, and career transitions from industry experts.
          </div>
        </div>
        
        </div>
      </div>
    </div>
  );
};

const MentorAccessSection = () => {
  // Intersection Observer hooks for different sections
  const [sectionRef, sectionInView] = useInView(0.2);
  const [textRef, textInView] = useInView(0.3);
  const [laptopRef, laptopInView] = useInView(0.2);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Profile data - easily customizable
  const profiles = [
    {
      name: "Marcus Johnson",
      role: "Tech Lead at Meta",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      size: "md",
      position: { top: "35%", left: "70%" },
    mobilePosition: { top: "10%", left: "10%" },
      delay: 700
    },
    {
      name: "Priya Patel",
      role: "Engineering Director",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      size: "md",
      position: { top: "25%", left: "25%" },
    mobilePosition: { top: "90%", left: "10%" },
      delay: 900
    },
    {
      name: "David Kim",
      role: "Startup Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      size: "lg",
      position: { top: "75%", left: "25%" },
    mobilePosition: { top: "80%", left: "90%" },
      delay: 600
    },
    {
      name: "Lisa Rodriguez",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      size: "md",
      position: { top: "80%", left: "75%" },
    mobilePosition: { top: "20%", left: "90%" },
      delay: 800
    },
    {
      name: "Alex Thompson",
      role: "Data Scientist",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      size: "sm",
      position: { top: "50%", left: "30%" },
    mobilePosition: { top: "60%", left: "15%" },
      delay: 1000
    },
    // {
    //   name: "Emma Wilson",
    //   role: "Marketing Director",
    //   image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    //   size: "md",
    //   position: { top: "25%", left: "20%" },
    // mobilePosition: { top: "80%", left: "90%" },
    //   delay: 1200
    // }
  ];

  return (
    <section ref={sectionRef} className="bg-white text-black relative overflow-hidden min-h-full py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
        {/* Right Side - Profile Layout */}
        <div 
          ref={laptopRef}
          className={`relative h-[400px] lg:h-[600px] px-4 md:px-12 lg:px-24 transition-all duration-1000 order-first lg:order-last ${
            laptopInView 
              ? 'opacity-100 transform translate-x-0 scale-100' 
              : 'opacity-0 transform translate-x-12 scale-95'
          }`}
          style={{ transitionDelay: '400ms' }}>
          {/* 🌟 Glow Background */}
          <div className="absolute inset-0 -z-10 flex justify-center items-center">
            <div className="w-[500px] h-[500px] bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full blur-[120px] opacity-40 animate-pulse" />
          </div>

          {/* Central Post */}
          <CentralPost isVisible={laptopInView} delay={400} />
          
          {/* Profile Cards */}
         {profiles.map((profile, index) => (
  <ProfileCard
    key={index}
    {...profile}
    position={isMobile ? profile.mobilePosition : profile.position} // 👈 choose mobile vs desktop
    isVisible={laptopInView}
  />
))}

        </div>

        {/* Left Text with Staggered Animations */}
        <div 
          ref={textRef}
          className={`space-y-6 z-10 px-4 md:px-12 lg:px-24 md:pt-0 pt-16 transition-all duration-1000 order-last lg:order-first ${
            textInView 
              ? 'opacity-100 transform translate-x-0' 
              : 'opacity-0 transform -translate-x-12'
          }`}
        >
          {/* Animated Heading */}
          <h2 className={`text-3xl md:text-5xl font-semibold leading-snug transition-all duration-1000 delay-200 ${
            textInView 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-8'
          }`}>
            Thrive with Real-Time <br />
            <span className={`italic font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-1000 delay-400 ${
              textInView ? 'animate-gradient-slide' : ''
            }`}>
              Access to 500+ Mentors
            </span>
          </h2>

          {/* Animated List Items */}
          <p className="text-lg text-gray-700 mb-6">
            Get instant support from 200+ expert mentors. Prep for interviews, 
            startup guidance, or personalized support. Connect with mentors in 
            under an hour and take the next step in your journey.
          </p>

          <button className="toperly-navbar-btn bg-[#2721F7] rounded-lg">
            <span className="toperly-navbar-btn-content">Connect with us</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-slide {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .animate-gradient-slide {
          background-size: 200% auto;
          animation: gradient-slide 2s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default MentorAccessSection;