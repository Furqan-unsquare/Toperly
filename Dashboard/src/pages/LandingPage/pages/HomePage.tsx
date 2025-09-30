import React from "react";
import HeroSection from "@/LandingPage/components/Home/HeroSection";
import FeaturesSection from "@/LandingPage/components/Home/FeaturesSection";
import TestimonialsSection from "@/LandingPage/components/Home/TestimonialsSection";
import MentorAccessSection from "@/LandingPage/components/Home/MentorAccessSection";
import InDemand from "@/LandingPage/components/Home/InDemand";
import TopRated from "@/LandingPage/components/Home/TopRated";
import SubscriptionPlans from "@/LandingPage/components/Home/SubscriptionPlans";
import FAQSection from "@/LandingPage/components/Contact/FAQ";
import AIToolsShowcase from "@/LandingPage/components/Home/AITools";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <TopRated />
      <InDemand />
      <FeaturesSection />
      <MentorAccessSection />
      <AIToolsShowcase />
      <SubscriptionPlans />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
};
 
export default Index;
