"use client"
import Link from "next/link";
import React from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

const HomePage = () => {

    useEffect(() => {
        AOS.init({
             duration: 800,
             once: false,
           })
     }, [])


  return (
    <section className="bg-black text-white h-screen min-h-screen text-center flex items-center justify-center">
  <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
    <div className="mx-auto max-w-5xl">
      <h1 data-aos="fade-down" className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-5xl">
        Empowering Your Career Journey with Expert Interview Guidance
      </h1>

      <p data-aos="fade-up" className="mx-auto mt-4 max-w-2xl sm:text-xl/relaxed">
        Transform your interview skills with <span className="text-blue-500 font-bold">AI IntelliMocker</span>
        <br />
        Go-to the platform for personalized mock interviews, real-time feedback, and strategic tips to ace your career milestones
      </p>

      <div data-aos="fade-up" className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          className="block w-full rounded border border-blue-500 bg-blue-500 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
          href="/dashboard"
        >
          Get Started
        </Link>
        <Link
          className="block w-full rounded border border-blue-white bg-white px-12 py-3 text-sm font-medium text-blue-500 hover:bg-transparent hover:text-blue-500 focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
          href="/contact"
        >
          Contact Us
        </Link>
      </div>
    </div>
  </div>
</section>
    
  );
};

export default HomePage;
