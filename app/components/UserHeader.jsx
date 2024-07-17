"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faBarsStaggered, faXmark } from "@fortawesome/free-solid-svg-icons";
import { line } from "drizzle-orm/pg-core";
// import { UserButton } from '@clerk/nextjs'
// import { usePathname } from 'next/navigation'
const UserHeader = () => {
  let Links = [
    { name: "DASHBOARD", link: "/dashboard" },
    { name: "RULES", link: "/rules" },
    { name: "HOW IT WORKS", link: "/user-how-it-work" },
    { name: "UPGRADE", link: "/user-upgrade" },
  ];
  let [open, setOpen] = useState(false);
  return (
    <div className="shadow-md w-full fixed top-0 left-0 z-10">
      <div className="md:flex items-center justify-between bg-blue-500 bg-opacity-20  py-5 md:px-10 px-7 backdrop-filter backdrop-blur-md">
        <div className="cursor-pointer">
          <Image src={"/logo1.png"} height={150} width={150} alt="logo"/>
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        >
          <FontAwesomeIcon icon={open ? faXmark : faBarsStaggered} className="text-black"/>
        </div>

        <ul
          className={`md:flex md:items-center bg-gray-900 md:bg-transparent md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20" : "top-[-490px]"
          }`}
        >
          {Links.map((link) => (
            <li key={link.name} className="md:ml-8 text-md md:my-0 my-7">
              <Link
                href={link.link}
                className="text-white hover:text-blue-500 duration-300"
              >
                {link.name}
              </Link>
            </li>
          ))}

          <div className=" gap-2 md:hidden lg:hidden">
              <UserButton></UserButton>
              <p className="font-bold text-white">My Profile</p>
          </div>
        </ul>
        <div className="lg:block hidden md:block">
            <UserButton></UserButton>
          </div>
      </div>
    </div>
  );
};

export default UserHeader;

