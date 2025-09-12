import HeroSection from "@/components/HeroSection";
import FeaturedPosts from "@/components/FeaturedPosts";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedPosts limit={6} />
      <Newsletter />
    </>
  );
}
