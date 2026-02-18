import { Hero } from "@/components/home/Hero";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { AboutSection } from "@/components/home/AboutSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedServices />
      <AboutSection />
    </main>
  );
}
