"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'


const Feedback = ({params}) => {

  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter()

    useEffect(()=>{
        getFeedback();
    })

    const getFeedback = async ()=>{
        const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

        // console.log(result)
        setFeedbackList(result)
    }
  
    let a= [];
    feedbackList.map((item)=>{
       a.push(item.rating)     
    });
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i];
  }
  return (
    <div className='my-20 space-y-2'>

        {feedbackList?.length==0?
          <h2 className='font-bold text-xl text-gray-600'>No interview feedback record found</h2>
          :
          <>
          <h2 className='text-3xl font-bold text-green-500'>Congulation</h2>
          <h2 className='font-bold text-2xl'>Here is your interview</h2>
        <h2 className='text-lg '>Your overall rating:  <strong>{sum}</strong></h2>

        <h2>Find </h2>
        {feedbackList && feedbackList.map((item, index)=>(
            <Collapsible key={index} className='mt-5'>
              <div className='p-2 bg-secondary rounded-lg my-2 flex justify-between text-left gap-6 w-full'>
              {item.question}
                <CollapsibleTrigger>
               <ChevronsUpDown className=''></ChevronsUpDown>
                </CollapsibleTrigger>
              </div>

                <CollapsibleContent>
                <div className='flex flex-col gap-2'>
                  <h2 className='p-2 rounded-lg bg-red-50 text-red-600 text-sm'><strong>Rating For Your Answer : </strong>{item.rating}</h2>
                  <h2 className='p-2 rounded-lg bg-orange-50 text-orange-600 text-sm'><strong>Your Answer : </strong>{item.userAns}</h2>
                  <h2 className='p-2 rounded-lg bg-green-50 text-green-600 text-sm'><strong>Correct Answer : </strong>{item.correctAns}</h2>
                  <h2 className='p-2 rounded-lg bg-blue-50 text-blue-600 text-sm'><strong>Feedback : </strong>{item.feedback}</h2>
                </div>
                </CollapsibleContent>
            </Collapsible>
        ))}
        </>
        }
        <Button onClick={()=>router.replace('/dashboard')}>Go Home {<FontAwesomeIcon icon={faHome} className='mx-2'/>}</Button>
    </div>
  )
}

export default Feedback