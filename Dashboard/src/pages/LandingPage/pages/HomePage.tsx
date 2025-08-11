import React from "react";
import HeroSection from "@/components/LandingPage/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import CoursesSection from "@/components/LandingPage/components/Home/TopRated";
import TestimonialsSection from "@/components/LandingPage/components/Home/TestimonialsSection";
import MentorAccessSection from "@/components/LandingPage/components/Home/MentorAccessSection";
import TrustedCoursesBrand from "@/components/Home/TrustedCoursesBrand";
import AdmissionsSection from "@/components/LandingPage/components/Home/CourseSection";
import VideoPitchSection from "@/components/Home/VideoPitchSection";
import About from "@/components/LandingPage/components/Home/About"
import AICommunityCards from "@/components/LandingPage/components/Home/AIcard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <About />
      <AdmissionsSection />
      {/* <FeaturesSection /> */}
      <AICommunityCards />
      <CoursesSection />
      {/* <TrustedCoursesBrand /> */}
      <MentorAccessSection />
      <TestimonialsSection />
      {/* <VideoPitchSection /> */}
    </div>
  );
};

export default Index;
