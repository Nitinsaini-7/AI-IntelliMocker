import { Button } from "@/components/ui/button";
import Image from "next/image";
import HomeHeader from "./components/Header";
import HomePage from "./components/Home";
import JobTitles from "./components/JobTitle";
import Benefits from "./components/Benefits";
import ContactPage from "./components/Contact";
import Footer from "./components/Footer";
import HowItWork from "./components/HowItWork";
import Features from "./components/Features";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HomeHeader/>
      <HomePage/>
      <JobTitles/>
      <Features/>
      <Benefits/>
      <HowItWork/>
      <ContactPage/>
      <Footer/>
    </div>
  );
}
