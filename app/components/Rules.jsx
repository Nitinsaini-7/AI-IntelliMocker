import React from 'react'

const Rules = () => {
    
const data = {
    "Preparation": {
      "Test Equipment": [
        "Ensure your webcam, microphone, and internet connection are working correctly.",
        "Conduct a test run to check the audio and video quality."
      ],
      "Environment": [
        "Choose a quiet and well-lit location for the interview.",
        "Make sure your background is clean and free from distractions."
      ],
      "Appearance": [
        "Dress professionally, as you would for an in-person interview.",
        "Maintain good posture and eye contact with the webcam."
      ]
    },
    "During the Interview": {
      "Introduction": [
        "Start with a brief introduction of yourself, including your name and a short professional summary."
      ],
      "Answering Questions": [
        "Listen carefully to each question before answering.",
        "Speak clearly and at a moderate pace.",
        "Stay on topic and provide concise and relevant answers."
      ],
      "Using Keywords": [
        "Be mindful of important keywords relevant to the job and industry.",
        "Incorporate these keywords naturally into your responses."
      ],
      "Non-Verbal Communication": [
        "Use appropriate facial expressions and gestures to convey enthusiasm and confidence.",
        "Avoid looking away from the screen frequently or fidgeting."
      ]
    },
    "Technical Aspects": {
      "Webcam Usage": [
        "Ensure your face is well-framed and clearly visible.",
        "Maintain a neutral and professional expression."
      ],
      "Voice Recording": [
        "Speak into the microphone at a consistent volume.",
        "Avoid background noise and interruptions."
      ],
      "Keyword Analysis": [
        "Understand the role of keywords in the interview process (e.g., how they may be used to assess your answers).",
        "Prepare to discuss key concepts and terminology relevant to the job."
      ]
    },
    "Post-Interview": {
      "Review and Feedback": [
        "Review the recording if available to assess your performance.",
        "Note areas for improvement for future interviews."
      ],
      "Follow-Up": [
        "Send a thank-you email to the interviewer, reiterating your interest in the position and highlighting key points from the interview."
      ]
    },
    "Ethical Considerations": {
      "Honesty": [
        "Provide truthful and accurate information.",
        "Avoid exaggerating or fabricating details about your experience and qualifications."
      ],
      "Confidentiality": [
        "Do not share proprietary or sensitive information from your current or previous employers.",
        "Respect the confidentiality of the interview process."
      ]
    }
  };
  
  return (
  
        <div className="lg:px-10 px-4 bg-white">
      <h1 data-aos="fade-up" className="underline underline-offset-8 decoration-blue-500 text-center text-4xl font-semibold my-10">Rules & Guidelines</h1>
      <p className='my-4 font-semibold'>There are some rules and guidelines regarding AI IntelliMocker:</p>
      {Object.keys(data).map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">{section}-</h2>
          {Object.keys(data[section]).map((subsection, subIndex) => (
            <div key={subIndex} className="mb-4">
              <h3 className="text-lg font-medium mb-2">{subsection}</h3>
              <ul className="list-disc list-inside pl-4">
                {data[section][subsection].map((item, itemIndex) => (
                  <li key={itemIndex} className="mb-2">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
   
  )
}

export default Rules