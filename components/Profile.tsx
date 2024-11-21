'use client'

import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'
import Image from 'next/image'

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;  // Adding photo_url to store the user's profile photo
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Ensure the code runs only in the client-side environment
    if (typeof window !== "undefined" && WebApp.initDataUnsafe.user) {
      // Set user data in state
      setUserData(WebApp.initDataUnsafe.user as UserData)
    }
  }, [])

  return (
    <div className="home-tab-con transition-all duration-300 flex items-center justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500">
      {/* Display user profile photo */}
      <Image
        src={userData?.photo_url || '/default-profile.png'} // Fallback to a default image if no profile photo is available
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover mb-8 border-[2px] border-grey-500 mt-6"
        width={128} // Set the size of the image
        height={128}
      />
      <div className="w-[98%] border-[2px] border-grey-500 p-2 flex justify-between mx-auto rounded-lg">
        <div>Name</div>
        <div>{userData ? userData.first_name : 'Loading...'}</div>
      </div>
      <div className="w-[98%] border-[2px] border-grey-500 p-2 flex justify-between mx-auto mt-3 rounded-lg">
        <div>Username</div>
        <div>{userData ? userData.username || 'N/A' : 'Loading...'}</div>
      </div>
      <div className="w-[98%] border-[2px] border-grey-500 p-2 flex justify-between mx-auto mt-3 rounded-lg">
        <div>UserId</div>
        <div>{userData ? userData.id : 'Loading...'}</div>
      </div>
    </div>
  )
}

export default Profile
