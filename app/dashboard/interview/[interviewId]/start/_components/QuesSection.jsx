"use client"
import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
const QuesSection = ({interviewQues, activeQuesIndex}) => {

  useEffect(() => {
    AOS.init({
         duration: 800,
         once: false,
       })
 }, [])
  

  const textToSpeech = (text)=>{
    if("speechSynthesis" in window){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }
    else{
      alert("sorry bro does not support")
    }
  }

  return interviewQues && (
    <div data-aos="fade-right" className='p-5 border rounded-lg my-10 mt-24'>

          <div className='border rounded-lg p-5 bg-blue-50 mb-5'>
            <h2 className='flex gap-2 items-center text-primary'>
              <Lightbulb/>
              <strong>Note</strong>
            </h2>
            <h2 className='text-sm my-2'>
              <li>Ensure your internet connection, webcam & microphone are working correctly.</li>
              <li>Listen carefully to each question before answering.</li>
              <li>Speak clearly and at a moderate pace.</li>
            </h2>
          </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {interviewQues&&interviewQues.map((question,index)=>(
             <h2 className={`p-2 border border-gray-300 rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuesIndex==index&&'bg-blue-500 text-white border border-white'}`}>{index+1}. Question</h2>
          ))}
        </div>

          <h2 className='my-5 text-md md:text-lg'>{interviewQues[activeQuesIndex]?.Question || interviewQues[activeQuesIndex]?.question}</h2>

          <Volume2 onClick={()=>textToSpeech(interviewQues[activeQuesIndex]?.Question || interviewQues[activeQuesIndex]?.question)} className='cursor-pointer'/>

          
    </div>
  )
}

export default QuesSection