import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { CircleStop, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { UserAnswer } from '@/utils/schema';
import AOS from 'aos';
import 'aos/dist/aos.css';

const RecordAnsSection = ({interviewQues, activeQuesIndex, interviewData}) => {

    useEffect(() => {
        AOS.init({
             duration: 800,
             once: false,
           })
     }, [])

    const [userAns, setUserAns] = useState('');
    const {user} = useUser();
    const [loading, setLoading] = useState(false);
    const {
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{
        results.map((result)=>(
            setUserAns(prevAns=>prevAns+result.transcript)
        ))
      },[results])

      useEffect(()=>{
        if(!isRecording&&userAns.length>10){
            updatedUserAns()
        }

      },[userAns])

      const sartStopRecording = async ()=>{
        if(isRecording){
            stopSpeechToText()
        }

        else{
            startSpeechToText()
        }
      }
    
      const updatedUserAns = async ()=>{
        console.log(userAns)
        setLoading(true)

        const feedBackPrompt = `Question:${interviewQues[activeQuesIndex]?.Question}, ${"User Answer:"} ${userAns}, ${"Depends on question and user answer for given interview question"}, 
                ${"plaease give us rating (in numbers out of 10) for answer and feedback as area of improvment if any"}, ${"in just 3 to 5 line to improve it in JSON format with rating field and feedback field"}` 
            
            const result = await chatSession.sendMessage(feedBackPrompt);

            const mockJsonResponse=(result.response.text()).replace('```json','').replace('```','');
            console.log(mockJsonResponse)

            const jsonFeedbackResponse = JSON.parse(mockJsonResponse);
            const response = await db.insert(UserAnswer)
            .values({
                mockIdRef:interviewData?.mockId,
                question:interviewQues[activeQuesIndex]?.Question || interviewQues[activeQuesIndex]?.question ,
                correctAns:interviewQues[activeQuesIndex]?.Answer || interviewQues[activeQuesIndex]?.answer,
                userAns:userAns,
                feedback:jsonFeedbackResponse?.feedback,
                rating:jsonFeedbackResponse.rating,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('dd-mm-yyyy')
            })

            if(response){
                toast('User answer recorded successfully');
                setUserAns('');
                setResults([]);
            }

            setLoading(false)

      }

  return (
    <div data-aos="fade-left" className='flex items-center justify-center flex-col'>
        <div className='flex flex-col justify-center items-center mb-2 rounded-lg p-5 bg-black'>
            <Image src={'/webcam.png'} width={200} height={200} className='absolute'/>

            <Webcam mirrored={true} style={{
                height:300,
                width:'100%',
                zIndex:10,
            }}/>
        </div>
        <Button 
        disabled={loading}
        variant="outline" onClick={sartStopRecording}>
            {isRecording ? 
            <h2 className='text-red-600 flex gap-2'>
                <CircleStop/> Stop Recording
            </h2> :    
            <h2 className='flex gap-2'>

                <Mic/> Record Answer
            </h2>}
        </Button>
        
    </div>
  )
}

export default RecordAnsSection