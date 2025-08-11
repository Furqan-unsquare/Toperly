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

const MentorAccessSection = () => {
  // Intersection Observer hooks for different sections
  const [sectionRef, sectionInView] = useInView(0.2);
  const [textRef, textInView] = useInView(0.3);
  const [laptopRef, laptopInView] = useInView(0.2);

  return (
    <section
      ref={sectionRef}
      className="bg-blue-500/10 text-black relative overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Text with Staggered Animations */}
        <div 
          ref={textRef}
          className={`space-y-6 z-10 px-4 md:px-12 lg:px-24 md:pt-0 pt-16 transition-all duration-1000 ${
            textInView 
              ? 'opacity-100 transform translate-x-0' 
              : 'opacity-0 transform -translate-x-12'
          }`}
        >
          {/* Animated Heading */}
          <h2 className={`text-3xl md:text-4xl font-semibold leading-snug transition-all duration-1000 delay-200 ${
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
          <ul className="space-y-4 text-[16px] md:text-[18px] text-gray-800">
            {[
              "Get instant support from 200+ expert mentors.",
              "Prep for interviews, startup, or support.",
              "Connect with mentors in under an hour."
            ].map((text, index) => (
              <li 
                key={index}
                className={`flex items-start gap-3 transition-all duration-800 ${
                  textInView 
                    ? 'opacity-100 transform translate-x-0' 
                    : 'opacity-0 transform -translate-x-8'
                }`}
                style={{ transitionDelay: `${600 + index * 200}ms` }}
              >
                <span className={`font-bold text-gray-700 w-6 h-6 rounded-full  flex items-center justify-center text-sm transition-all duration-500`} style={{ animationDelay: `${800 + index * 200}ms` }}>
                  {index + 1}
                </span>
                <span className="flex-1">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Animated Laptop */}
        <div 
          ref={laptopRef}
          className={`bg-gradient-mobile px-4 md:px-12 lg:px-24 transition-all duration-1000 ${
            laptopInView 
              ? 'opacity-100 transform translate-x-0 scale-100' 
              : 'opacity-0 transform translate-x-12 scale-95'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="relative w-full max-w-2xl mx-auto z-10 mb-10">
            {/* MacBook Image with Hover Effect */}
            <div className={`relative transition-all duration-1000 }`}>
              <img
                src="/macbook.png"
                alt="MacBook"
                className="w-full h-auto z-10 relative transform transition-all duration-500"
              />
    </div>

            {/* Screen content with Enhanced Animation */}
            <div className={`absolute top-[2%] left-[11%] w-[77%] h-[93%] overflow-hidden z-20 transition-all duration-1000`} style={{ transitionDelay: '800ms' }}>
              <img
                src="/dashboard.png"
                className="w-full h-full object-fill rounded-[8px] transition-all duration-500"
                alt="Mentor Dashboard"
              />
              
              {/* Screen Overlay Effects */}
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none transition-opacity duration-1000 ${
                laptopInView ? 'animate-screen-shine' : 'opacity-0'
              }`}></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-slide {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes number-pop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(-90deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes laptop-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes screen-shine {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
        }
        
        @keyframes badge-float {
          0% { 
            transform: scale(0) translateY(20px); 
            opacity: 0; 
            rotation: 180deg; 
          }
          60% { 
            transform: scale(1.1) translateY(-5px); 
            rotation: -10deg; 
          }
          100% { 
            transform: scale(1) translateY(0); 
            opacity: 1; 
            rotation: 0deg; 
          }
        }
        
        @keyframes fadeInLeft {
          0% { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes fadeInRight {
          0% { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slideInUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .animate-gradient-slide {
          background-size: 200% auto;
          animation: gradient-slide 2s ease-in-out;
        }
        
        .animate-number-pop {
          animation: number-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .animate-laptop-float {
          animation: laptop-float 4s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animate-screen-shine {
          animation: screen-shine 2s ease-out infinite 2s;
        }
        
        .animate-badge-float {
          animation: badge-float 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
      `}</style>
    </section>
  );
};

export default MentorAccessSection;
