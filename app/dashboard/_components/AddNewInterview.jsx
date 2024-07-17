"use client"
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
    const [openDailog, setOpenDailog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc, setJobDesc] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const {user} = useUser();
    const router = useRouter();

    const onSubmit = async(e)=>{
        setLoading(true)
        e.preventDefault()
        console.log(jobPosition,jobDesc,jobExperience)

        const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}, Depends on this information please give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT} Interview Question with Answered in JSON Format, Give Question and Answered as field in JSON`
        
        const result = await chatSession.sendMessage(inputPrompt);
        const mockJsonResponse = (result.response.text()).replace('```json','').replace('```','');
        setJsonResponse(mockJsonResponse);

    if (mockJsonResponse) {
        const resp = await db.insert(MockInterview)
            .values({
                mockId: uuidv4(),
                jsonMockResponse: mockJsonResponse,
                jobPosition: jobPosition,
                jobDesc: jobDesc,
                jobExperience: jobExperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY')
            }).returning({ mockId: MockInterview.mockId });
        
        console.log(`inserted ID: ${resp}`);

        if(resp){
          setOpenDailog(false);
          router.push(`./dashboard/interview/${resp[0]?.mockId}`)
        }
    } 
    
    else {
        console.log("error: mockJsonResponse is not defined");
    }

      setLoading(false)
    }

  return (
    <div className="mb-5">
      <div data-aos="fade-down" onClick={()=>setOpenDailog(true)} className="p-10 rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all">
        <h2 className="font-bold text-lg">+ Add New</h2>
      </div>
      <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about your Interview</DialogTitle>
            <DialogDescription>
                <form onSubmit={onSubmit}>
                    <div>
                        <h2 className="text-gray-500"> Add details about job position/role </h2>
                        <div className="mt-7 my-2 text-left text-black">
                            <label>Job Role/Job Position</label>
                            <Input type="text" onChange={(e)=>setJobPosition(e.target.value)} placeholder="Ex. Full Stack Dev" required></Input>
                        </div>

                        <div className="my-4 text-left text-black">
                            <label htmlFor="">Job Description /Tech Stack (In Short)</label>
                            <Textarea type="text" onChange={(e)=>setJobDesc(e.target.value)} placeholder="Ex. React, Next.Js, Node.Js, MySql etc." required></Textarea>
                        </div>

                        <div className="my-4 text-left text-black">
                            <label htmlFor="">Year of Experience</label>
                            <Input onChange={(e)=>setJobExperience(e.target.value)} placeholder="Ex. 5 Years" type="number" min="0" required></Input>
                        </div>
                    </div>
                    <div className="flex gap-5 justify-end">
                        <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancle</Button>
                        <Button type="submit">
                            {loading ? 
                            <>
                                <LoaderCircle className="animate-spin"/> "Generating From AI"
                            </>
                            :"Start Interview"}
                          </Button>
                    </div>
                </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
