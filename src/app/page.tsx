import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import Features from '@/components/sections/Features';
import Categories from '@/components/sections/Categories';
import PopularProducts from '@/components/sections/PopularProducts';
import LatestNews from '@/components/sections/LatestNews';
import Newsletter from '@/components/sections/Newsletter';

export default function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <Categories />
      <PopularProducts />
      {/* <LatestNews /> */}
      <Newsletter />
    </>
  );
} 