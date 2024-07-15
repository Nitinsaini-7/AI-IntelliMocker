import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

const Dashboard = () => {
  return (
    <div data-aos="fade-down" className='p-5 mt-5'>
      <h1 className='font-bold text-2xl mt-10'>Dashboard</h1>
      <h2 className='text-gray-500'>Create and start your AI Mock Interview</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 my-5 lg:px-0 px-4'>
        <AddNewInterview></AddNewInterview>
      </div>

      <InterviewList></InterviewList>

    </div>
  )
}

export default Dashboard