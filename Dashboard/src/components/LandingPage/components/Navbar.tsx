import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Menu, X, Search, Home, BookOpen, PenTool, Mail, Folder, Sparkles, Globe, User, Shield, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { useAuth } from '@/contexts/AuthContext';

// Animated AI Wave Component
const AnimatedAIWave = () => (
  <svg
    className="absolute left-0 -bottom-6 w-full h-32 z-0 pointer-events-none"
    viewBox="0 0 1440 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="aiWave" x1="0" y1="0" x2="1" y2="0">
        <stop stopColor="#3b82f6" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <path
      d="M0,192 C480,304 960,80 1440,192 L1440,320 L0,320 Z"
      fill="url(#aiWave)"
      opacity="0.18"
    >
      <animate
        attributeName="d"
        dur="7s"
        repeatCount="indefinite"
        values="
          M0,192 C480,304 960,80 1440,192 L1440,320 L0,320 Z;
          M0,160 C480,100 960,250 1440,160 L1440,320 L0,320 Z;
          M0,192 C480,304 960,80 1440,192 L1440,320 L0,320 Z
        "
      />
      <animate
        attributeName="opacity"
        values="0.18;0.22;0.18"
        dur="5s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

// Sub-component for Search Results
const SearchResults = ({ filtered, setQuery, setFiltered, toggleMobileMenu, isScrolled }) => {
  const navigate = useNavigate();

  return (
    <ul
      className={`absolute top-full left-0 mt-1 w-[300px] bg-gray-300 border rounded-sm shadow z-50 max-h-60 overflow-y-auto ${
        isScrolled ? 'border-gray-200' : 'border-gray-600'
      }`}
    >
      {filtered.length === 0 ? (
        <li className="px-4 py-2 text-sm text-gray-500">No courses found</li>
      ) : (
        filtered.map((course) => (
          <li
            key={course._id}
            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
            onClick={() => {
              navigate(`/courses/${course._id}`);
              setQuery('');
              setFiltered([]);
              toggleMobileMenu?.();
            }}
            role="option"
            aria-label={`Go to course: ${course.title}`}
          >
            <div className='flex justify-between'>
              <div className="font-medium text-gray-900">{course.title}</div>
              <div className="text-gray-900 font-semibold text-lg">₹{course.price}</div>
            </div>
            <div className="text-gray-600 text-xs mt-1">Category: {course.category}</div>
          </li>
        ))
      )}
    </ul>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('Eng');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Fetch courses and derive categories
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/api/courses/');
        const courseData = Array.isArray(res.data) ? res.data : [res.data];
        if (courseData.every((course) => course._id && course.title && course.price)) {
          setCourses(courseData);
          const uniqueCategories = [...new Set(courseData.map((course) => course.category))].filter(Boolean);
          setCategories(uniqueCategories);
        } else {
          setError('Invalid course data format');
        }
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error('Failed to fetch courses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value) => {
      if (value.length < 2) {
        setFiltered([]);
        return;
      }
      const results = courses
        .filter(
          (course) =>
            course.title.toLowerCase().includes(value.toLowerCase()) ||
            course.description.toLowerCase().includes(value.toLowerCase()) ||
            course.category.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => a.title.localeCompare(b.title));
      setFiltered(results);
    }, 300),
    [courses]
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsCategoriesOpen(true);
    setIsProfileOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Determine dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return '/auth/login';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'instructor':
        return '/dashboard';
      case 'admin':
      case 'subadmin':
        return '/admin/dashboard';
      default:
        return '/auth/login';
    }
  };

  // Get role-specific icon
  const getRoleIcon = () => {
    if (!user) return null;
    switch (user.role) {
      case 'student':
        return <BookOpen className="h-4 w-4 mr-1" /> ;
      case 'instructor':
        return <User className="h-4 w-4 mr-1" />;
      case 'admin':
        return <Shield className="h-4 w-4 mr-1" />;
      case 'subadmin':
        return <UserCheck className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const mainNavItems = [
    { label: 'All Courses', href: '/courses', icon: 'book' },
    { label: 'Blog', href: '/blogs', icon: 'pen' },
    { label: 'Subscription', href: '/subscription-plans', icon: 'sparkles' },
    { label: 'Contact', href: '/contact-us', icon: 'mail' },
  ];
  const topNavItems = [
    { label: 'Become an Instructor', href: '/auth/login' },
    { label: 'My learning', href: '/auth/login' },
  ];
  const languages = ['Eng', 'Hin', 'Mar'];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'shadow-lg backdrop-blur-md bg-white/5' : 'text-white bg-transparent'
      } ${isScrolled ? 'h-16' : 'h-16 sm:h-24'}`}
    >
      {/* Top row */}
      <div
        className={`${
          isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'sm:h-12 opacity-100'
        } transition-all duration-300 ${
          isScrolled ? 'bg-gray-200' : location.pathname === '/' ? 'bg-gray-900' : 'text-black bg-gray-50'
        } ${isScrolled ? 'border-gray-200' : 'border-gray-700'}`}
      >
        <div className="max-w-7xl mx-auto pt-2 px-4 h-full flex items-center justify-end">
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <p className='text-gray-500'>Welcome to Toperly</p>
            {topNavItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`cursor-pointer underline transition-colors duration-200 text-gray-500`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className={`${isScrolled ? 'h-16' : 'h-14 sm:h-16'} transition-all duration-300`}>
        <div className="px-20 mx-auto h-full flex items-center justify-between">
          {/* Logo & Categories */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <a href="/" className="hover:opacity-80 transition-opacity">
                <img src="/logo.png" alt="Toperly Logo" className="h-10 w-auto object-contain" />
              </a>
              <div className="relative group hidden lg:flex">
                <button
                  className={`font-medium focus:outline-none flex items-center transition-colors duration-300 ${
                    isScrolled ? 'text-gray-500 hover:text-gray-500' : 'text-gray-400 hover:text-gray-400'
                  }`}
                >
                  Categories
                  <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:scale-100 scale-95 z-50">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <div
                        key={cat}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors duration-200"
                        onClick={() => navigate(`/courses?category=${encodeURIComponent(cat)}`)}
                      >
                        {cat}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No categories available</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {mainNavItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-gray-500 hover:text-gray-500' : 'text-gray-400 hover:text-gray-700'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search for anything"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className={`w-64 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 ${
                  isScrolled
                    ? 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-200'
                    : 'bg-gray-700 text-gray-900 placeholder-gray-400 border-gray-600'
                }`}
                aria-label="Search courses"
              />
              <button className="absolute right-3 top-2.5">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin" />
                ) : (
                  <svg
                    className={`w-4 h-4 transition-colors duration-300 ${isScrolled ? 'text-gray-500' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>
              {query && <SearchResults filtered={filtered} setQuery={setQuery} setFiltered={setFiltered} isScrolled={isScrolled} />}
            </div>

            {/* Login/Sign-up or Profile Dropdown */}
            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-2">
                  <button
                    className={`flex items-center text-sm font-medium transition-colors duration-300 ${
                      isScrolled ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={toggleProfileMenu}
                  >
                    {getRoleIcon()}
                    {user.name.split(' ')[0]}
                    <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300" />
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                      >
                        <a
                          href={getDashboardPath()}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(getDashboardPath());
                            setIsProfileOpen(false);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        >
                          Dashboard
                        </a>
                        <a
                          href="/settings"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('/settings');
                            setIsProfileOpen(false);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        >
                          Settings
                        </a>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isScrolled ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => navigate('/auth/login')}
                  >
                    Login
                  </button>
                  <button
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isScrolled
                        ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    onClick={() => navigate('/auth/login')}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative group hidden md:flex">
              <button
                className={`flex items-center text-sm font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Globe className="h-4 w-4 mr-1" />
                {language}
                <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:scale-100 scale-95 z-50">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors duration-200"
                    onClick={() => setLanguage(lang)}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className={`lg:hidden p-2 rounded-md transition-all relative z-[60] ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={toggleMobileMenu}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              />
              <motion.div
                key="mobile-menu"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 w-full max-w-sm h-full bg-white z-50 shadow-xl overflow-y-auto"
              >
                <button
                  onClick={toggleMobileMenu}
                  className="absolute right-5 top-4 text-gray-500 p-2 rounded-full hover:text-black hover:bg-gray-200 transition-all z-[60]"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="relative flex flex-col px-6 pt-16 pb-10 min-h-screen">
                  {/* Search */}
                  <div className="relative mb-8">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="Ask AI to find courses..."
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          handleSearch(e.target.value);
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 placeholder-gray-500 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                        aria-label="Search courses"
                      />
                      {query && (
                        <button
                          onClick={() => setQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                    {query && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SearchResults
                          filtered={filtered}
                          setQuery={setQuery}
                          setFiltered={setFiltered}
                          toggleMobileMenu={toggleMobileMenu}
                          isScrolled={isScrolled}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
                  )}

                  {/* Main nav links */}
                  <nav className="flex flex-col space-y-1 mb-3">
                    {mainNavItems.map((item, index) => (
                      <motion.a
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                        href={item.href}
                        className="group block py-3 px-4 rounded-lg hover:bg-blue-50/50 transition-all duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.href);
                          toggleMobileMenu();
                        }}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center mr-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <span className="text-blue-600 group-hover:text-blue-800 transition-colors">
                              {item.icon === 'home' && <Home size={18} />}
                              {item.icon === 'book' && <BookOpen size={18} />}
                              {item.icon === 'pen' && <PenTool size={18} />}
                              {item.icon === 'mail' && <Mail size={18} />}
                              {item.icon === 'sparkles' && <Sparkles size={18} />}
                            </span>
                          </div>
                          <span className="text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </span>
                        </div>
                      </motion.a>
                    ))}
                  </nav>

                  {/* Categories */}
                  <div>
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: mainNavItems.length * 0.05 + 0.1 }}
                      className="flex items-center justify-between w-full font-medium text-gray-900 focus:outline-none rounded-xl bg-blue-50/50 px-4 py-3 hover:bg-blue-100 transition-colors duration-300 group"
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      aria-expanded={isCategoriesOpen}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center mr-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Folder className="text-blue-600" size={18} />
                        </div>
                        <span className="text-lg font-medium">Categories</span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                          isCategoriesOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </motion.button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: isCategoriesOpen ? 'auto' : 0,
                        opacity: isCategoriesOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-2">
                        {categories.length > 0 ? (
                          categories.map((cat, index) => (
                            <motion.a
                              key={cat}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 + 0.15 }}
                              href={`/courses?category=${encodeURIComponent(cat)}`}
                              className="flex items-center py-2 px-4 text-base text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200 group"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/courses?category=${encodeURIComponent(cat)}`);
                                toggleMobileMenu();
                              }}
                            >
                              <span className="w-2 h-2 mr-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                              <span className="group-hover:translate-x-1 transition-transform duration-200">
                                {cat}
                              </span>
                            </motion.a>
                          ))
                        ) : (
                          <div className="py-2 px-4 text-base text-gray-600">No categories available</div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Language Selector in Mobile */}
                  <div className="mt-4">
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (mainNavItems.length + 1) * 0.05 + 0.1 }}
                      className="flex items-center justify-between w-full font-medium text-gray-900 focus:outline-none rounded-xl bg-blue-50/50 px-4 py-3 hover:bg-blue-100 transition-colors duration-300 group"
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      aria-expanded={isCategoriesOpen}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center mr-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Globe className="text-blue-600" size={18} />
                        </div>
                        <span className="text-lg font-medium">Language: {language}</span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                          isCategoriesOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </motion.button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: isCategoriesOpen ? 'auto' : 0,
                        opacity: isCategoriesOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-2">
                        {languages.map((lang, index) => (
                          <motion.div
                            key={lang}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 + 0.15 }}
                            className="flex items-center py-2 px-4 text-base text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200 group"
                            onClick={() => {
                              setLanguage(lang);
                              toggleMobileMenu();
                            }}
                          >
                            <span className="w-2 h-2 mr-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                              {lang}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Profile Dropdown in Mobile */}
                  {user && (
                    <div className="mt-4">
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (mainNavItems.length + 2) * 0.05 + 0.1 }}
                        className="flex items-center justify-between w-full font-medium text-gray-900 focus:outline-none rounded-xl bg-blue-50/50 px-4 py-3 hover:bg-blue-100 transition-colors duration-300 group"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        aria-expanded={isProfileOpen}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center mr-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            {getRoleIcon()}
                          </div>
                          <span className="text-lg font-medium">Profile: {user.name.split(' ')[0]}</span>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                            isProfileOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </motion.button>
                      <motion.div
                        initial={false}
                        animate={{
                          height: isProfileOpen ? 'auto' : 0,
                          opacity: isProfileOpen ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-2">
                          <motion.a
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            href={getDashboardPath()}
                            className="flex items-center py-2 px-4 text-base text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200 group"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(getDashboardPath());
                              toggleMobileMenu();
                            }}
                          >
                            <span className="w-2 h-2 mr-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                              Dashboard
                            </span>
                          </motion.a>
                          <motion.a
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            href="/settings"
                            className="flex items-center py-2 px-4 text-base text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200 group"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/settings');
                              toggleMobileMenu();
                            }}
                          >
                            <span className="w-2 h-2 mr-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                            <span className="group-hover:translate-x-

1 transition-transform duration-200">
                              Settings
                            </span>
                          </motion.a>
                          <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            onClick={handleLogout}
                            className="flex items-center w-full text-left py-2 px-4 text-base text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200 group"
                          >
                            <span className="w-2 h-2 mr-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                              Logout
                            </span>
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                  <AnimatedAIWave />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;