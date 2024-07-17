"use client"
import Image from 'next/image'
import React from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

const Features = () => {

    useEffect(() => {
        AOS.init({
             duration: 800,
             once: false,
           })
     }, [])

  return (

    <div>
        <h1 data-aos="fade-up" className='underline underline-offset-8 decoration-blue-500 text-center text-4xl font-semibold my-10'>Features</h1>

        <h2 data-aos="fade-up" className='text-center text-3xl text-black'>Practice Interview with AI</h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 m-5 mx-5'>
            <Image data-aos="fade-right" src={"/interviewAI.jpg"} height={600} width={600} alt='features' className='rounded-sm'></Image>

            <div data-aos="fade-left" className='grid grid-cols-1 gap-2'>
                <div className='flex items-center rounded-sm  bg-slate-200 h-24 w-full gap-4'>
                    <p className='bg-slate-300 w-6 h-6 text-center ml-4'> ✔</p>
                    <p>Improve Performance</p>
                </div>

                <div className='flex items-center rounded-sm bg-slate-100 h-24 w-full gap-4'>
                    <p className='bg-slate-300 w-6 h-6 text-center ml-4'> ✔</p>
                    <p>Practice & Feedback</p>
                </div>

                <div className='flex items-center rounded-sm bg-slate-200 h-24 w-full gap-4'>
                    <p className='bg-slate-300 w-6 h-6 text-center ml-4'> ✔</p>
                    <p>Convenient & Flexible</p>
                </div>

                <div className='flex items-center rounded-sm bg-slate-100 h-24 w-full gap-4'>
                    <p className='bg-slate-300 w-6 h-6 text-center ml-4'> ✔</p>
                    <p>Cost-effective Efficiency</p>
                </div>
            </div>
        </div>
    </div>

  )
}

export default Features