"use client"
import React from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

const Benefits = () => {

    useEffect(() => {
        AOS.init({
             duration: 800,
             once: false,
           })
     }, [])


    const benefitData = [
        {
            id: 1,
            cover: "interview.png",
            title: "Master your interview game.",
            content: "Practice on countless role-specific mock question & answers tailored to your dream job, including multiple rounds for ultimate preparation. Get personalized feedback from experts to refine your responses and nail every question." 
        },

        {
            id: 2,
            cover: "self-confidence.png",
            title: "Boost your confidence",
            content: "Conquer interview anxiety with unlimited practice in a safe, supportive environment. Gain valuable insights and feedback to hone your communication skills and project confidence in front of any hiring manager." 
        },

        {
            id: 3,
            cover: "community.png",
            title: "Join a thriving community",
            content: "Build a network of fellow job seekers, share interview experiences, and learn from each other's success. Find encouragement, motivation, and insider tipnavigate the job search with a supportive communication by your side." 
        }
    ]

  return (
    <div>
        <h1 data-aos="fade-up" className='text-center text-4xl font-semibold my-10 underline underline-offset-8 decoration-blue-500'>Benefits</h1>

        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-y-10 lg:mx-2'>
        {benefitData.map((val)=>(
            <div className='mx-6 lg:mx-4'>
               <div data-aos="fade-up" className='bg-blue-100 w-full rounded-md cursor-pointer p-4'>
                    <div className='flex items-center justify-center'>
                        <img src={val.cover} alt="" className='w-20 h-20'/>
                    </div>
                    <p className='text-center text-black mt-2 font-bold'>{val.title}</p>
                    <p className='text-center'>{val.content}</p>
                </div>
            </div>
            ))}
        </div>

    </div>
  )
}

export default Benefits