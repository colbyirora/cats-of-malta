import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Meowncil from '@/components/Meowncil';
import CatGallery from '@/components/CatGallery';
import CatMap from '@/components/CatMap';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import PawCursor from '@/components/PawCursor';
import { supabase } from '@/lib/supabase';
import { sampleCats } from '@/lib/sample-data';
import type { Cat } from '@/lib/types';

export const revalidate = 60; // revalidate every 60 seconds

async function getCats(): Promise<Cat[]> {
  try {
    const { data, error } = await supabase
      .from('cats')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return sampleCats;
    }

    return data;
  } catch {
    return sampleCats;
  }
}

export default async function Home() {
  const cats = await getCats();

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
