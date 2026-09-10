import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { WhyCampusIQ } from "@/components/home/WhyCampusIQ";
import { BentoGrid } from "@/components/home/BentoGrid";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { Footer } from "@/components/home/Footer";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection />
      <StatsSection />
      <WhyCampusIQ />
      <BentoGrid />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
