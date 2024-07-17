"use client"
import React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarsStaggered, faXmark } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
    
  let Links =[
    {name:"HOME",link:"/"},
    {name:"FATURES",link:"/features"},
    {name:"HOW IT WORKS",link:"/how-it-work"},
    {name:"UPGRADE",link:"/upgrade"},
    {name:"CONTACT",link:"/contact"},
  ];
  let [open,setOpen]=useState(false);
return (
  <div className='shadow-md w-full fixed top-0 left-0 z-10'>
    <div className='md:flex items-center justify-between bg-blue-500 bg-opacity-30  py-5 md:px-10 px-7 backdrop-filter backdrop-blur-md'>
    <div className='cursor-pointer'>
      <Image src={'/logo1.png'} height={150}width={150} alt='logo' className='drop-shadow-lg'/>
    </div>
    
    <div onClick={()=>setOpen(!open)} className='text-3xl absolute right-8 top-6 cursor-pointer md:hidden'>
    <FontAwesomeIcon className='text-white' icon={open ? faXmark : faBarsStaggered}/>
    </div>

    <ul className={`md:flex md:items-center md:bg-transparent md:pb-0 pb-12 absolute md:static bg-gray-900 lg:border-none md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-20':'top-[-490px]'}`}>
      {
        Links.map((link)=>(
          <li key={link.name} className='md:ml-8 text-md md:my-0 my-7'>
            <Link href={link.link} className='text-white hover:text-blue-500 duration-300'>{link.name}</Link>
          </li>
        ))
      }
    </ul>
    </div>
  </div>
  )
}

export default Header