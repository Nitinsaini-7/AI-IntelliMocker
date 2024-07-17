"use client"
import Link from 'next/link'
import React from 'react'
import 'aos/dist/aos.css';
import { useEffect } from "react";
import AOS from 'aos';

const JobTitles = () => {

    useEffect(() => {
        AOS.init({
             duration: 800,
             once: false,
           })
     }, [])

    const jobTitle = [
        {
            id: 1,
            cover: "accounting.png",
            title: "Accounting",
        },

        {
            id: 2,
            cover: "architecture.png",
            title: "Architecture & Construction"
        },

        {
            id: 3,
            cover: "art.png",
            title: "Art",
        },

        {
            id: 4,
            cover: "bank.png",
            title: "Banking"
        },
        
        {
            id: 5,
            cover: "education.png",
            title: "Education",
        },

        {
            id: 6,
            cover: "engineering.png",
            title: "Engineering"
        },
        
        {
            id: 7,
            cover: "government.png",
            title: "Government & Public Admin",
        },

        {
            id: 8,
            cover: "health.png",
            title: "Health Care"
        },
        
        {
            id: 9,
            cover: "human-service.png",
            title: "Human Services",
        },

        {
            id: 10,
            cover: "information-technology.png",
            title: "Information Technology"
        },

        {
            id: 11,
            cover: "insurance.png",
            title: "Insurance"
        },

        {
            id: 12,
            cover: "journalism.png",
            title: "Journalism"
        },

        {
            id: 13,
            cover: "law.png",
            title: "Law"
        },

        {
            id: 14,
            cover: "marketing.png",
            title: "Marketing"
        },

        {
            id: 15,
            cover: "public-safety.png",
            title: "Public Safety & Security"
        },

        {
            id: 16,
            cover: "school.png",
            title: "School Admission"
        },

        {
            id: 17,
            cover: "science.png",
            title: "Science"
        }
    ]
 
  return (
    <div>
        <div data-aos="fade-up">
            <h1 className='text-center text-4xl font-semibold mx-10 my-10'>Mock Interview for Over <span className='text-blue-500'>20+</span> Job Titles</h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-10'>
        {jobTitle.map((val)=>(
            <div className='mx-6'>
               <Link href={'/dashboard'}>
               <div data-aos="fade-up" className='bg-white w-full py-6 shadow-md rounded-md border hover:bg-blue-400 hover:text-white border-gray-50 cursor-pointer hover:transform ease-out duration-300 hover:scale-105'>
                    <div className='flex items-center justify-center'>
                        <img src={val.cover} alt="job" className='w-20 h-20 drop-shadow-lg'/>
                    </div>
                    <p className='text-center mt-6 font-bold'>{val.title}</p>
                </div>
               </Link>
            </div>
            ))}
        </div>
    </div>
  )
}

export default JobTitles