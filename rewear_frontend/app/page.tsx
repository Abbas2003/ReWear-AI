import React from "react";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Cta from "@/components/landing/cta";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <HowItWorks />
      <Cta />
    </div>
  );
}
