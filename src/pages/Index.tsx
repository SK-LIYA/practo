
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { SpecialtiesSection } from "@/components/home/SpecialtiesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeaturedDoctorsSection } from "@/components/home/FeaturedDoctorsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { DownloadAppSection } from "@/components/home/DownloadAppSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <SpecialtiesSection />
        <HowItWorksSection />
        <FeaturedDoctorsSection />
        <TestimonialsSection />
        <DownloadAppSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
