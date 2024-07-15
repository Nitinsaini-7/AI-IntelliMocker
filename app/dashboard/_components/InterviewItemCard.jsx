import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'


const InterviewItemCard = ({interview}) => {

    const router = useRouter();

    const onStart = ()=>{
        router.push(`/dashboard/interview/${interview?.mockId}`)
    }

    const onFeedback = ()=>{
        router.push(`/dashboard/interview/${interview.mockId}/feedback`)
    }
  return (
    <div data-aos="fade-up" className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-blue-500 capitalize'>{interview?.jobPosition}</h2>
        <h2>{interview?.jobExperience} Years of Experience</h2>
        <h2>Created At: {interview?.createdAt}</h2>

        <div className='flex justify-between mt-2 gap-5'>
            <Button onClick={onFeedback}  size="sm" variant="outline" className='w-full'>Feedback</Button>
            <Button onClick={onStart} size="sm" className='w-full bg-blue-500 hover:bg-blue-400'>Start</Button>

        </div>
    </div>
  )
}

export default InterviewItemCard