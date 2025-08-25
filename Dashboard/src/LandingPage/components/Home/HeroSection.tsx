import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, TrendingUp, ArrowRight, Shield, Cpu, Database, Users, Atom, Network, Eye, Sparkles } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import Button from './Button';
import { useInView } from 'react-intersection-observer';

const DarkAIHero = () => {
  const [loadingStage, setLoadingStage] = useState('bg');
  const [animateChip, setAnimateChip] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

   useEffect(() => {
    // Sequenced animation timing
    const sequence = [
      { delay: 0, action: () => setLoadingStage('bg') },
      { delay: 500, action: () => setLoadingStage('content') },
      { delay: 800, action: () => setLoadingStage('complete') },
      { delay: 600, action: () => setAnimateChip(true) },
    ];

    const timers = sequence.map(({ delay, action }) => 
      setTimeout(action, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  const zoomOut = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
    }
  }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const fadeUp = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const getBackgroundStyle = () => ({
    background: `
      radial-gradient(circle at 20% 80%, rgba(30, 58, 138, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(29, 78, 216, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, #000000 0%, #2721F7 100%)
    `,
  });

  return (
    <motion.section 
      ref={ref}
      className="min-h-screen flex items-left justify-center relative overflow-hidden py-20"
      style={getBackgroundStyle()}
      initial="hidden"
      animate={controls}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Light Beams */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
          animate={{
            x: ['-100%', '200%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-80 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
          animate={{
            x: ['200%', '-100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1.5,
            ease: 'easeInOut'
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-16  mt-4 md:mt-12 items-left"
          variants={container}
        >
          {/* Left Content */}
          <div className=" mx-auto text-left">
            {/* Premium Badge */}
            <motion.div 
              className="inline-flex items-center md:mt-6 px-6 py-3 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold mb-8 border shadow-2xl bg-blue-500/20 text-blue-400 border-blue-500/30"
              variants={zoomOut}
            >
              <Shield className="w-4 h-4 mr-2 text-blue-400" />
              Secure Your Spot in India's First AI Academy
              <motion.div 
                className="w-2 h-2 rounded-full ml-2 bg-blue-400"
                animate={{
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </motion.div>
            
            {/* Main Title */}
            <motion.h1 
              className="text-[3.2rem] sm:text-6xl lg:text-7xl font-black leading-[0.9] mb-8 tracking-tight"
              variants={zoomOut}
            >
              <span className="bg-gradient-to-b from-gray-500 via-gray-300 to-gray-100 text-transparent bg-clip-text leading-none">
                Making India Ready for the Future with AI
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xs sm:text-lg mb-10 mx-auto text-justify leading-relaxed text-gray-300"
              variants={zoomOut}
              transition={{ delay: 0.3 }}
            >
                "we’re not just teaching  <span className="font-semibold text-blue-400">AI</span> — we’re shaping the next generation of innovators and job creators.
                From small-town students to professionals seeking change, we make AI learning accessible in your own language."
            </motion.p>

            {/* Action Button */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-start mb-10"
              variants={fadeIn}
              transition={{ delay: 0.6 }}
            >
              <Button />
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 text-left"
              variants={container}
            >
              {[
                { value: '25K+', label: 'Languages', icon: Users },
                { value: '20,000+', label: 'Learners', icon: Cpu },
                { value: '15+', label: 'Experts', icon: TrendingUp }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="group p-4 rounded-xl transition-all"
                  // variants={fadeUp}
                  custom={index}
                  whileHover={{ y: -5 }}
                  style={{ 
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="flex flex-col items-left">
                    <div className="flex items-center mb-2">
                      <div className="text-xl sm:text-4xl font-black text-blue-400">
                        {stat.value}
                      </div>
                      {/* <motion.div
                        whileHover={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <stat.icon className="w-6 h-6 text-blue-400" />
                      </motion.div> */}
                    </div>
                    <div className="text-xs md:text-sm font-medium text-gray-300">
                      {stat.label}
                    </div>
                    <div className="w-full h-1 rounded-full mt-3 bg-blue-200/20">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-300"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: stat.value === '98%' ? 0.98 : 1 }}
                        transition={{ 
                          delay: 0.8 + index * 0.2,
                          type: 'spring'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Optional AI Visualization */}
        <div 
          className={`relative transition-all  mt-10 md:mt-40 duration-1000 ${
            loadingStage !== 'bg' 
              ? 'opacity-100 transform translate-y-0 scale-100' 
              : 'opacity-0 transform translate-y-8 scale-90'
          }`}
        >
          <div className="relative group">
            
            {/* Main AI Chip Container */}
            <div className="relative mx-auto w-80 h-80 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-400/20 shadow-blue-500/25 shadow-2xl backdrop-blur-sm border border-white/10 overflow-hidden animate-container-glow">
              
              {/* Circuit Board Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 320 320" className="absolute inset-0">
                  Circuit Lines
                  {animateChip && (
                    <>
                      {/* Horizontal Lines */}
                      <path d="M0 80 L320 80" stroke="#1e3a8a" strokeWidth="1" className="animate-circuit-draw" />
                      <path d="M0 160 L320 160" stroke="#3b82f6" strokeWidth="1" className="animate-circuit-draw" />
                      <path d="M0 240 L320 240" stroke="#1e3a8a" strokeWidth="1" className="animate-circuit-draw" />
                      
                      {/* Vertical Lines */}
                      <path d="M80 0 L80 320" stroke="#3b82f6" strokeWidth="1" className="animate-circuit-draw" />
                      <path d="M160 0 L160 320" stroke="#1e3a8a" strokeWidth="1" className="animate-circuit-draw" />
                      <path d="M240 0 L240 320" stroke="#3b82f6" strokeWidth="1" className="animate-circuit-draw" />
                      
                      {/* Connection Points */}
                      <circle cx="80" cy="80" r="3" fill="#1e3a8a" className="animate-pulse-point-infinite" />
                      <circle cx="160" cy="160" r="4" fill="#3b82f6" className="animate-pulse-point-infinite" />
                      <circle cx="240" cy="240" r="3" fill="#1e3a8a" className="animate-pulse-point-infinite" />
                      <circle cx="240" cy="80" r="3" fill="#3b82f6" className="animate-pulse-point-infinite" />
                      <circle cx="80" cy="240" r="3" fill="#1e3a8a" className="animate-pulse-point-infinite" />
                    </>
                  )}
                </svg>
              </div>

              {/* Central AI Brain */}
              <div className="absolute inset-8 flex items-center justify-center">
                <div className={`relative text-blue-400 transition-all duration-1000 ${
                  animateChip ? 'animate-brain-activate' : 'opacity-60'
                }`}>
                  <Brain className="w-32 h-32 animate-brain-pulse" />
                  
                  {/* Neural Network Lines Emanating from Brain */}
                  {animateChip && (
                    <div className="absolute inset-0">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-px h-12 bg-gradient-to-t from-blue-400/80 to-transparent animate-neural-pulse-infinite"
                          style={{
                            left: '50%',
                            top: '50%',
                            transformOrigin: 'bottom',
                            transform: `rotate(${i * 45}deg) translateY(-64px)`,
                            animationDelay: `${i * 0.2}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Corner Chips with Circuit Animation */}
              {[
                { icon: Shield, position: 'top-4 left-4', color: 'blue' },
                { icon: Database, position: 'top-4 right-4', color: 'blue-light' },
                { icon: Network, position: 'bottom-4 left-4', color: 'blue' },
                { icon: Eye, position: 'bottom-4 right-4', color: 'blue-light' }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`absolute ${item.position} p-3 rounded-xl backdrop-blur-lg bg-black/20 border shadow-lg transition-all duration-1000 ${
                    animateChip ? 'animate-chip-activate border-blue-500/30 shadow-blue-500/20' : 'border-gray-500/20'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${
                    item.color === 'blue' ? 'text-blue-400' : 'text-blue-300'
                  }`} />
                </div>
              ))}

              {/* Data Flow Particles */}
              {animateChip && [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-blue-400 animate-data-flow-infinite"
                  style={{
                    animationDelay: `${i * 0.8}s`,
                    left: '50%',
                    top: '50%'
                  }}
                />
              ))}
            </div>

            {/* Enhanced Floating Info Cards */}
            <div className={`absolute -top-6 -right-6 p-4 rounded-2xl backdrop-blur-lg bg-black/40 border border-blue-500/20 shadow-blue-500/20 shadow-lg transition-all duration-1000 ${
              animateChip ? 'animate-info-card-reveal' : 'opacity-0 scale-75'
            }`}>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-xs font-semibold text-blue-400">
                    Neural Processing
                  </div>
                  <div className="text-xs text-gray-400">
                    Real-time Verification
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`absolute bottom-6 -left-6 p-4 rounded-2xl backdrop-blur-lg bg-black/40 border border-blue-500/20 shadow-blue-500/20 shadow-lg transition-all duration-1000 ${
              animateChip ? 'animate-info-card-reveal' : 'opacity-0 scale-75'
            }`}>
              <div className="flex items-center space-x-2">
                <Database className="w-6 h-6 animate-database-pulse text-blue-400" />
                <div>
                  <div className="text-xs font-semibold text-blue-400">
                    Trusted AI Base
                  </div>
                  <div className="text-xs text-gray-400">
                    1M+ Verified Models
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>         
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DarkAIHero;