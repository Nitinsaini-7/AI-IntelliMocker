"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Interview = ({ params }) => {

    useEffect(() => {
        AOS.init({
             duration: 800,
             once: false,
           })
     }, [])


  const [interviewData, setInterviewData] = useState(true);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId,params.interviewId));
      setInterviewData(result[0]);
  };

  return (
    <div className="my-10 mt-24">
      <h2 data-aos="fade-right" className="font-bold text-2xl mb-5">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div data-aos="fade-right" className="flex flex-col my-5 gap-5">
          <div className="flex flex-col gap-5 p-5 rounded-lg border border-slate-100 bg-slate-50">
            <h2 className="font-bold capitalize">
              <strong>Job Role/Job Position: </strong>
              {interviewData.jobPosition}
            </h2>
            <h2 className="font-bold capitalize">
              <strong>Description/Tech Stack: </strong>
              {interviewData.jobDesc}
            </h2>
            <h2 className="font-bold capitalize">
              <strong>Years of Experience: </strong>
              {interviewData.jobExperience}
            </h2>
          </div>
            <div className="p-4 border rounded-lg border-yellow-500 bg-yellow-50">
              <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb/></h2><strong className="text-yellow-500">Information</strong>
              <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>
        </div>

        <div data-aos="fade-left">
          {webCamEnabled ? 
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            /> : 
            <>
              <WebcamIcon className="h-72 w-full p-20 bg-secondary rounded-lg border"></WebcamIcon>
              <div className="flex items-center justify-center">
                <Button onClick={() => setWebCamEnabled(true)} className="mt-5 bg-black hover:bg-gray-100 hover:text-black"> Enable Web Cam and Microphone</Button>
              </div>
            </>
          }

          <div className="mt-10 w-full">
            <Link href={`/dashboard/interview/${params.interviewId}/start`}>
              <Button className='bg-blue-500 hover:bg-blue-400 w-full'>Start Interview</Button> 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
