"use client"
import React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faBarsStaggered, faXmark } from '@fortawesome/free-solid-svg-icons'
// import { UserButton } from '@clerk/nextjs'
// import { usePathname } from 'next/navigation'
const HomeHeader = () => {
    
  let Links =[
    {name:"HOME",link:"/home"},
    {name:"ABOUT",link:"/"},
    {name:"UPGRADE",link:"/"},
    {name:"HOW IT WORKS",link:"/"},
    {name:"CONTACT",link:"/contact"},
  ];
  let [open,setOpen]=useState(false);
return (
  <div className='shadow-md w-full fixed top-0 left-0'>
    <div className='md:flex items-center justify-between bg-blue-500 bg-opacity-20 py-5 md:px-10 px-7 backdrop-filter backdrop-blur-md'>
    <div className='font-bold text-2xl cursor-pointer flex items-center text-gray-800'>
      <Image src={'/logo.svg'} height={100}width={100}/>
    </div>
    
    <div onClick={()=>setOpen(!open)} className='text-3xl absolute right-8 top-3 cursor-pointer md:hidden'>
    <FontAwesomeIcon icon={open ? faXmark : faBarsStaggered}/>
    </div>

    <ul className={`md:flex md:items-center md:bg-transparent md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-20':'top-[-490px]'}`}>
      {
        Links.map((link)=>(
          <li key={link.name} className='md:ml-8 text-md md:my-0 my-7'>
            <Link href={link.link} className='text-gray-800 hover:text-blue-400 duration-300'>{link.name}</Link>
          </li>
        ))
      }
    </ul>
    </div>
  </div>
  )
}

export default HomeHeader