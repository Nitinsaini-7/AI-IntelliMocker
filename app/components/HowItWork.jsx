"use client"
import Image from 'next/image'
import React from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

const HowItWork = () => {

    useEffect(() => {
        AOS.init({
             duration: 800,
             once: false,
           })
     }, [])

  return (
    <div>
        <h1 data-aos="fade-up" className='underline underline-offset-8 decoration-blue-500 text-center text-4xl font-semibold my-10'>How It Works</h1>
        <div data-aos="fade-up" className='grid grid-cols-1 mx-10 gap-5'>
            <p className='text-justify '>This free interview preparation tool allows you to practice your interview
                techniques and produce a Video CV which can be shared with anyone, including recruiters and employers.
                Go-to the platform for personalized mock interviews, real-time feedback, and strategic tips to ace your career milestones.
            </p>

            <div className='lg:mx-4 grid grid-cols-1 gap-2'>
                <p className='font-bold'>Here are some of the benefits:</p>

                <div className='flex'>
                <span className='text-blue-500 mr-4'>✔</span>
                <p className='text-justify'>The ability to practice your interview techniques privately in your own time</p>
                </div>

                <div className='flex'>
                <span className='text-blue-500 mr-4'>✔</span>
                <p className='text-justify'>The option to share your answers as a video CV with employers to help you showcase your personality and secure your dream job</p>
                </div>

                <div className='flex'>
                <span className='text-blue-500 mr-4'>✔</span>
                <p className='text-justify'>Access to expert tips from business leaders and hiring managers on how to answer the most common interview questions</p>
                </div>
            </div>
           
        </div>

        <div>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-20 mx-5  lg:mx-20 mt-10'>
                <div data-aos="fade-up" className='grid place-items-center shadow-custom border rounded-md p-5'>
                    <Image alt='img' src={"/answer.jpg"} height={250} width={250}></Image>
                    <p className='mb-4 font-bold'>Answer</p>
                    <p className='text-center'>Record your answers to the mock interview questions on video using a computer, or smartphone.</p>
                </div>

                <div data-aos="fade-up" className='grid place-items-center shadow-custom border rounded-md p-5'>
                    <Image alt='img' src={"/improve.jpg"} height={250} width={250}></Image>
                    <p className='mb-4 font-bold'>Improve</p>
                    <p className='text-center'>Playback your answers as often as you like or share them with someone you trust for feedback.</p>
                </div>

                <div data-aos="fade-up" className='grid place-items-center shadow-custom border rounded-md p-5'>
                    <Image alt='img' src={"/get-hired.jpg"} height={250} width={250}></Image>
                    <p className='mb-4 font-bold'>Get Hired</p>
                    <p className='text-center'>Standout from the crowd! Your 30% more likely to secure your new job with a video CV.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HowItWork