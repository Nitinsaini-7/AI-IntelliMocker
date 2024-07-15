"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
const Header = () => {

    const path = usePathname();
    
    useEffect(()=>{
        console.log(path)
    },[])

  return (
    <div className='flex p-5 items-center justify-between bg-slate-300 shadow-sm'>
        <Image src={'/logo.svg'} width={160} height={100} alt='logo'></Image>
        <ul className='hidden md:flex gap-8'>
            <li className={`hover:text-blue-500 hover:font-semibold transition-all cursor-pointer 
            ${path=='/dashboard' && 'text-blue-500 font-semibold'}`}>Dashboard</li>

            <li className={`hover:text-blue-500 hover:font-semibold transition-all cursor-pointer 
            ${path=='/dashboard/questions' && 'text-blue-500 font-semibold' }`}>Questions</li>

            <li className={`hover:text-blue-500 hover:font-semibold transition-all cursor-pointer 
            ${path=='/dashboard/upgrade' && 'text-blue-500 font-semibold'}`}>Upgrade</li>

            <li className={`hover:text-blue-500 hover:font-semibold transition-all cursor-pointer 
            ${path=='/dashboard/how' && 'text-blue-500 font-semibold'}`}>How it work</li>
        </ul>
        <UserButton></UserButton>
    </div>
  )
}

export default Header