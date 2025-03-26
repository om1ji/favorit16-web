"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-grow`}>{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
