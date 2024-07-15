// "use client"
import Link from 'next/link'
import React from 'react'
const JobTitles = () => {

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
        <h2 className='text-center text-black text-4xl font-bold my-10'>Mock Interview for Over <span className='text-blue-500'>20+</span> Job Titles</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-10'>
        {jobTitle.map((val)=>(
            <div className='mx-4'>
               <Link href={'/dashboard'}>
               <div className='bg-white w-full py-8 shadow-lg rounded-md border border-gray-50 cursor-pointer hover:transform ease-out duration-300 hover:scale-110'>
                    <div className='flex items-center justify-center'>
                        <img src={val.cover} alt="" className='w-20 h-20 drop-shadow-lg'/>
                    </div>
                    <p className='text-center text-black mt-2 font-bold'>{val.title}</p>
                </div>
               </Link>
            </div>
            ))}
        </div>
    </div>
  )
}

export default JobTitles