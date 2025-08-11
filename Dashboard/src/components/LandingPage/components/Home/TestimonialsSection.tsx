import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote, Brain, TrendingUp } from "lucide-react";

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

const TestimonialsSection = () => {
  // Intersection Observer hooks
  const [sectionRef, sectionInView] = useInView(0.1);
  const [headerRef, headerInView] = useInView(0.3);
  const [cardsRef, cardsInView] = useInView(0.2);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Data Scientist at Google",
      company: "Google",
      content: "Toperly's AI-powered learning completely revolutionized. The adaptive curriculum and real-time feedback accelerated my skills beyond what I thought possible.",
      rating: 5,
      initials: "SC",
      achievement: "200% salary increase"
    },
    {
      name: "Lisa Wang",
      role: "Chief Technology Officer",
      company: "Fortune 500",
      content: "I needed to understand AI's transformative potential. Toperly's executive course gave me the strategic framework to lead our company's AI transformation successfully.",
      rating: 5,
      initials: "LW",
      achievement: "Led digital transformation"
    },
    {
      name: "James Miller",
      role: "AI Solutions Architect",
      company: "Amazon Web Services",
      content: "The AI-powered learning system adapted perfectly to my schedule and learning style. I went from beginner to deploying production ML models in just 3 months.",
      rating: 5,
      initials: "JM",
      achievement: "AWS ML certification"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="reviews" 
      className="py-14 bg-blue-500/10 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sectionInView && (
          <>
            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full opacity-60 "
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${4 + Math.random() * 4}s`
                }}
              />
            ))}
            
            {/* Subtle light beams */}
            <div className="absolute top-20 left-0 w-96 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-beam-flow"></div>
            <div className="absolute bottom-32 right-0 w-80 h-px bg-gradient-to-l from-transparent via-primary/20 to-transparent animate-beam-flow-reverse"></div>
          </>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Animated Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-1000 ${
            headerInView 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-8'
          }`}
        >
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black mb-6 transition-all duration-1000 delay-200 ${
            headerInView ? 'animate-title-reveal' : ''
          }`}>
            Trusted by{" "}
            <span className={`bg-gradient-primary bg-clip-text text-transparent transition-all duration-1000 delay-400 ${
              headerInView ? 'animate-gradient-flow' : ''
            }`}>
              Industry Leaders
            </span>
          </h2>
          <p className={`text-sm md:text-xl text-muted-foreground max-w-4xl mx-auto transition-all duration-1000 delay-600 ${
            headerInView 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
          }`}>
            Join thousands of AI professionals who've transformed their careers 
            with our courses
          </p>
        </div>

        {/* Testimonials with Enhanced Animations */}
        <div 
          ref={cardsRef}
          className="relative -mt-16"
        >
          {/* Mobile horizontal scroll container */}
          <div className="md:hidden pb-6 -mx-4 px-4">
            <div className="flex overflow-x-auto space-x-4 py-2 scrollbar-hide">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.name}
                  className={`flex-none w-[85vw] max-w-sm transition-all duration-1000 ${
                    cardsInView 
                      ? 'opacity-100 transform translate-x-0 scale-100' 
                      : 'opacity-0 transform translate-x-8 scale-95'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <Card className={`group hover:shadow-elevated transition-all duration-700 border-0 bg-card/90 backdrop-blur-sm h-full overflow-hidden hover:scale-105 hover:-translate-y-2`} style={{ animationDelay: `${800 + index * 200}ms` }}>
                    <CardContent className="p-6 relative h-full">
                      
                      {/* Animated Quote Icon */}
                      <div className="absolute top-4 right-4">
                        <Quote className={`w-8 h-8 text-primary/20 transition-all duration-500 ${
                          cardsInView ? 'animate-quote-pulse' : ''
                        }`} style={{ animationDelay: `${1000 + index * 200}ms` }} />
                      </div>
                      
                      {/* Animated Stars */}
                      <div className="flex space-x-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 fill-yellow-400 text-yellow-400 transition-all duration-500 ${
                              cardsInView ? 'animate-star-sparkle' : 'opacity-0 scale-0'
                            }`}
                            style={{ animationDelay: `${1200 + index * 200 + i * 100}ms` }}
                          />
                        ))}
                      </div>
                      
                      <p className="line-clamp-4 text-muted-foreground mb-4 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      
                      {/* Animated Avatar Section */}
                      <div className="flex items-center space-x-4 mb-3">
                        <Avatar className={`w-10 h-10 group-hover:ring-2 group-hover:ring-primary/20 transition-all duration-500 ${
                          cardsInView ? 'animate-avatar-pop' : 'opacity-0 scale-0'
                        }`} style={{ animationDelay: `${1400 + index * 200}ms` }}>
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`transition-all duration-800 ${
                          cardsInView 
                            ? 'opacity-100 transform translate-x-0' 
                            : 'opacity-0 transform translate-x-4'
                        }`} style={{ transitionDelay: `${1500 + index * 200}ms` }}>
                          <div className="font-bold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          <div className="text-xs font-semibold text-primary">{testimonial.company}</div>
                        </div>
                      </div>
                      
                      {/* Animated Achievement Badge */}
                      <div className={`bg-gradient-neural p-2 rounded-lg border border-primary/20 transition-all duration-800 ${
                        cardsInView 
                          ? 'opacity-100 transform translate-y-0' 
                          : 'opacity-0 transform translate-y-4'
                      }`} style={{ transitionDelay: `${1600 + index * 200}ms` }}>
                        <div className="text-xs font-semibold text-primary">Achievement:</div>
                        <div className="text-xs text-muted-foreground">{testimonial.achievement}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop grid layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name}
                className={`group hover:shadow-elevated border border-gray-200 transition-all duration-700 bg-card/90 backdrop-blur-sm overflow-hidden hover:-translate-y-2 ${
                  cardsInView 
                    ? 'opacity-100 transform translate-y-0 scale-100 ' 
                    : 'opacity-0 transform translate-y-8 scale-95'
                }`}
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  animationDelay: `${800 + index * 200}ms`
                }}
              >
                <CardContent className="p-8 relative">
                  
                  {/* Animated Quote Icon */}
                  <div className="absolute top-4 right-4">
                    <Quote className={`w-8 h-8 text-primary/20 transition-all duration-500 ${
                      cardsInView ? 'animate-quote-pulse' : ''
                    }`} style={{ animationDelay: `${1000 + index * 200}ms` }} />
                  </div>
                  
                  {/* Animated Stars */}
                  <div className="flex space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 fill-yellow-400 text-yellow-400 transition-all duration-500 ${
                          cardsInView ? 'animate-star-sparkle' : 'opacity-0 scale-0'
                        }`}
                        style={{ animationDelay: `${1200 + index * 200 + i * 100}ms` }}
                      />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Animated Avatar Section */}
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className={`w-12 h-12 group-hover:ring-2 group-hover:ring-primary/20 transition-all duration-500 ${
                      cardsInView ? 'animate-avatar-pop' : 'opacity-0 scale-0'
                    }`} style={{ animationDelay: `${1400 + index * 200}ms` }}>
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-lg">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`transition-all duration-800 ${
                      cardsInView 
                        ? 'opacity-100 transform translate-x-0' 
                        : 'opacity-0 transform translate-x-4'
                    }`} style={{ transitionDelay: `${1500 + index * 200}ms` }}>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs font-semibold text-primary">{testimonial.company}</div>
                    </div>
                  </div>
                  
                  {/* Animated Achievement Badge */}
                  <div className={`bg-gradient-neural p-3 rounded-lg border border-primary/20 transition-all duration-800 ${
                    cardsInView 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-0 transform translate-y-4'
                  }`} style={{ transitionDelay: `${1600 + index * 200}ms` }}>
                    <div className="text-sm font-semibold text-primary">Achievement:</div>
                    <div className="text-xs text-muted-foreground">{testimonial.achievement}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes beam-flow {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%); opacity: 0; }
        }

        @keyframes beam-flow-reverse {
          0% { transform: translateX(200%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }

        @keyframes title-reveal {
          0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes gradient-flow {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes quote-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }

        @keyframes star-sparkle {
          0% { opacity: 0; transform: scale(0) rotate(-180deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(-90deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        @keyframes avatar-pop {
          0% { opacity: 0; transform: scale(0) rotate(180deg); }
          60% { transform: scale(1.1) rotate(-10deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-beam-flow { animation: beam-flow 4s ease-in-out infinite; }
        .animate-beam-flow-reverse { animation: beam-flow-reverse 4s ease-in-out infinite 2s; }
        .animate-title-reveal { animation: title-reveal 1s ease-out forwards; }
        .animate-gradient-flow { 
          background-size: 200% auto;
          animation: gradient-flow 2s ease-in-out forwards; 
        }
        .animate-card-float { animation: card-float 3s ease-in-out infinite; }
        .animate-quote-pulse { animation: quote-pulse 2s ease-in-out infinite; }
        .animate-star-sparkle { animation: star-sparkle 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-avatar-pop { animation: avatar-pop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
