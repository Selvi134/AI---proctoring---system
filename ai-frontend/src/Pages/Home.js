import React from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Cards from "../Components/Cards";
import Features from "../Components/Features";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Cards />
      <Features />
    </div>
  );
}

export default Home;