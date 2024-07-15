"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuesSection from './_components/QuesSection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StartInterview = ({params}) => {
  
  const [interviewData, setInterviewData] = useState();
  const [interviewQues, setInterviewQues] = useState();
  const [activeQuesIndex, setActiveQuesIndex] = useState(0);
  useEffect(()=>{
    GetInterviewDetails();
  },[])

  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId,params.interviewId));
      console.log(result[0])
      const jsonMockResponse=JSON.parse(result[0].jsonMockResponse)
      console.log(jsonMockResponse);
      setInterviewQues(jsonMockResponse);
      setInterviewData(result[0])
  };

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Questions */}

        <QuesSection interviewQues={interviewQues} 
          activeQuesIndex={activeQuesIndex}
        />

        {/* Vedio/Audio */}

        <RecordAnsSection interviewQues={interviewQues} 
          activeQuesIndex={activeQuesIndex}
          interviewData={interviewData}/>
      </div>

      <div className='flex justify-center items-center mr-3 gap-4 w-full lg:-mt-6 my-4'>
        {activeQuesIndex>0 && 
        <Button onClick={()=>setActiveQuesIndex(activeQuesIndex-1)} className='ease-out transform hover:scale-95 transition duration-500 inline bg-primary'>Previous Question</Button>}

        {activeQuesIndex!=interviewQues?.length-1 && 
        <Button onClick={()=>setActiveQuesIndex(activeQuesIndex+1)} className='ease-out transform hover:scale-95 transition duration-500 inline bg-primary'>Next Question</Button>}
        
        {activeQuesIndex==interviewQues?.length-1 &&
        <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
          <Button className='ease-out transform hover:scale-95 transition duration-500 inline bg-green-500 hover:bg-white hover:border hover:border-green-500 hover:text-green-500'>End Interview</Button>
        </Link>}
      </div>
    </div>
  )
}

export default StartInterview