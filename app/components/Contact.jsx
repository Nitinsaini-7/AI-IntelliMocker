"use client"
import Image from 'next/image'
import React from 'react'
import emailjs from 'emailjs-com'
import { toast } from 'sonner'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";


const Contact = () => {

    useEffect(() => {
        AOS.init({
             duration: 800,
             once: false,
           })
     }, [])

  const triggerEmail = async (data) =>{
    await emailjs.send("service_qvqpo9m", "template_1kxp7xp", data, "qI-gSOn0zhMO4n1A2").then((success)=>{
      toast(<div className='text-green-600'>Your message send successfully.</div>);
    }).catch((err)=>{
      toast(<div className='text-red-600'>Something went wrong</div>)
      console.log(err)
    })
  }

  const formSubmit = (e)=>{
    e.preventDefault()
    console.log(e.target)

    const data = {
      name: e.target[0].value,
      email: e.target[1].value,
      mobile: e.target[2].value,
      message: e.target[3].value
    }
    console.log(data)
    triggerEmail(data)
  }

  return (

  <div className="w-full px-4 sm:px-6 lg:px-8 mb-10">
    <h1 data-aos="fade-up" className='text-center text-4xl font-semibold my-10'>Contact</h1>
    <div className="grid rounded-md grid-cols-1 gap-x-4 gap-y-8 lg:grid-cols-5 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_10px] lg:mx-20">
      <div data-aos="fade-right" className="lg:col-span-2 lg:py-12 mx-4 lg:m-5">
        <h2 className='text-center text-3xl my-4'>Connect With Us</h2>
        <Image src={'/contact.avif'} height={500} width={500}></Image>
        <p className='text-center'>Please take a moment to get in touch, we will get back to you shortly</p>
      </div>

      <div data-aos="fade-left" className="rounded-md bg-blue-50 p-8 lg:m-10 mb-5 mx-4 border border-blue-200 lg:col-span-3 lg:p-12">
        <form action="#" onSubmit={formSubmit} className="space-y-4">
          <div>
            <label className="sr-only" htmlFor="name">Name</label>
            <input
              className="w-full rounded-md p-3 text-sm"
              placeholder="Name"
              type="text"
              id="name"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <input
                className="w-full rounded-md p-3 text-sm"
                placeholder="Email address"
                type="email"
                id="email"
                required
              />
            </div>

            <div>
              <label className="sr-only" htmlFor="phone">Phone</label>
              <input
                className="w-full rounded-md p-3 text-sm"
                placeholder="Phone Number"
                type="tel"
                id="phone"
                required
              />
            </div>
          </div>

          <div>
            <label className="sr-only" htmlFor="message">Message</label>

            <textarea
              className="w-full rounded-md p-3 text-sm"
              placeholder="Message"
              rows="8"
              id="message"
              required
            ></textarea>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="inline-block w-full shadow-xl rounded-md py-3 px-6 bg-blue-500 hover:bg-blue-400 text-white sm:w-auto"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  )
}

export default Contact