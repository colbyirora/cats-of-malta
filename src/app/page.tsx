import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Meowncil from '@/components/Meowncil';
import CatGallery from '@/components/CatGallery';
import CatMap from '@/components/CatMap';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import PawCursor from '@/components/PawCursor';
import { sampleCats } from '@/lib/sample-data';

export default function Home() {
  // In production, fetch cats from Supabase
  const cats = sampleCats;

  return (
    <div className="min-h-screen">
      <PawCursor />
      <Header />
      <main>
        <Hero />
        <Meowncil />
        <CatGallery cats={cats} />
        <CatMap cats={cats} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
