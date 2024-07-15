import React from 'react'
import Header from '../userheader/page';
import UserHeader from '../components/UserHeader';

const DashboardLayout = ({children}) => {
  return (
    <div>
      <UserHeader></UserHeader>
      <div className='mx-5 md:mx-20 lg:mx-36'>
        {children}  
      </div>
    </div>
  )
}

export default DashboardLayout;