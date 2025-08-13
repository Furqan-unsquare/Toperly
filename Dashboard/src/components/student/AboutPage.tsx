// pages/AboutPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Users,
  Award,
  Target,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Cpu,
  Database,
  Code,
  Zap,
  Heart,
  Shield,
  Clock,
  Trophy,
} from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: "25,000+", label: "Students Worldwide", color: "bg-blue-500" },
    { icon: BookOpen, value: "150+", label: "AI/ML Courses", color: "bg-green-500" },
    { icon: Award, value: "50+", label: "Expert Instructors", color: "bg-purple-500" },
    { icon: Trophy, value: "95%", label: "Success Rate", color: "bg-orange-500" },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We stay ahead of AI/ML trends, constantly updating our curriculum with cutting-edge technologies and methodologies.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Building a global community where learners collaborate, share knowledge, and grow together in their AI journey.",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: Target,
      title: "Results Focused",
      description: "Every course is designed with real-world applications in mind, ensuring you can immediately apply what you learn.",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: Heart,
      title: "Student Success",
      description: "Your success is our mission. We provide personalized support and mentorship throughout your learning journey.",
      color: "from-red-400 to-pink-500"
    },
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Technology Officer",
      specialty: "Deep Learning & Neural Networks",
      image: null,
      bio: "Former AI researcher at Google with 15+ years in machine learning.",
    },
    {
      name: "Prof. Michael Rodriguez",
      role: "Head of Curriculum",
      specialty: "Computer Vision & NLP",
      image: null,
      bio: "Published author and professor with expertise in AI applications.",
    },
    {
      name: "Dr. Priya Sharma",
      role: "Lead Data Scientist",
      specialty: "MLOps & Production AI",
      image: null,
      bio: "Industry veteran who scaled AI solutions at Fortune 500 companies.",
    },
    {
      name: "James Wilson",
      role: "Head of Student Success",
      specialty: "Career Development",
      image: null,
      bio: "Helped 10,000+ students transition into AI/ML careers successfully.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Toperly Founded",
      description: "Started with a vision to democratize AI/ML education worldwide.",
      icon: Lightbulb,
    },
    {
      year: "2021",
      title: "First 1,000 Students",
      description: "Reached our first major milestone with students from 20 countries.",
      icon: Users,
    },
    {
      year: "2022",
      title: "Industry Partnerships",
      description: "Partnered with leading tech companies for real-world projects.",
      icon: Target,
    },
    {
      year: "2023",
      title: "AI Certification Program",
      description: "Launched comprehensive certification recognized by industry leaders.",
      icon: Award,
    },
    {
      year: "2024",
      title: "25,000+ Students",
      description: "Became the leading AI/ML education platform with global reach.",
      icon: TrendingUp,
    },
  ];

  const specializations = [
    {
      icon: Brain,
      title: "Machine Learning",
      description: "From fundamentals to advanced algorithms, master ML concepts with hands-on projects.",
      courses: 45,
    },
    {
      icon: Cpu,
      title: "Deep Learning",
      description: "Neural networks, CNNs, RNNs, and Transformers - build state-of-the-art AI models.",
      courses: 35,
    },
    {
      icon: Database,
      title: "Data Science",
      description: "Extract insights from data using statistical analysis and visualization techniques.",
      courses: 40,
    },
    {
      icon: Code,
      title: "AI Engineering",
      description: "Deploy and scale AI solutions in production environments with best practices.",
      courses: 30,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Brain size={32} className="text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Toperly
              </h1>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Empowering the Next Generation of{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Innovators
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              We're on a mission to make artificial intelligence and machine learning accessible to everyone. 
              Join thousands of students who have transformed their careers with our expert-led courses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/courses')}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold transform hover:scale-105"
              >
                Explore AI Courses
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold border border-gray-200"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon size={28} className="text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission: Democratizing AI Education
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Toperly, we believe that artificial intelligence shouldn't be limited to a select few. 
                Our comprehensive curriculum breaks down complex AI concepts into digestible, practical lessons 
                that anyone can understand and apply.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you're a complete beginner or looking to advance your existing skills, our courses 
                are designed to take you from theory to real-world application, with industry-relevant projects 
                and hands-on experience.
              </p>
              <div className="space-y-4">
                {[
                  "Industry-relevant curriculum updated quarterly",
                  "Hands-on projects with real datasets",
                  "1-on-1 mentorship from AI experts",
                  "Job placement assistance and career support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Course Completion", value: "94%" },
                    { label: "Job Placement", value: "87%" },
                    { label: "Salary Increase", value: "65%" },
                    { label: "Student Satisfaction", value: "4.9/5" },
                  ].map((metric, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Success Metrics</h4>
                  <p className="text-sm text-gray-600">Based on 2023 graduate survey</p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Star size={16} />
                  <span className="font-semibold">Top Rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our AI/ML Specializations
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive courses covering every aspect of artificial intelligence and machine learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specializations.map((spec, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <spec.icon size={24} className="text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {spec.title}
                </h4>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {spec.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {spec.courses} courses
                  </span>
                  <button 
                    onClick={() => navigate(`/courses?category=${spec.title.toLowerCase().replace(' ', '-')}`)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Learn More
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Toperly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-6`}>
                  <value.icon size={28} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Journey
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From a small startup to the leading AI education platform
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 to-purple-200"></div>

            <div className="space-y-8 lg:space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <milestone.icon size={20} className="text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {milestone.year}
                        </div>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden lg:flex w-2/12 justify-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
                  </div>

                  <div className="hidden lg:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Expert Team
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn from industry leaders who have shaped the AI landscape
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl font-bold text-gray-600">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h4>
                <p className="text-blue-600 font-medium mb-2 text-sm">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {member.specialty}
                </p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your AI Journey?
          </h3>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of students who have transformed their careers with our comprehensive AI/ML courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold transform hover:scale-105"
            >
              Browse Courses
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-transparent text-white rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
