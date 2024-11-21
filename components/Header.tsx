'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import WebApp from '@twa-dev/sdk'

const CheckFootprint = () => {
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

    useEffect(() => {
        // Check if WebApp SDK is initialized and user data is available
        if (WebApp.initDataUnsafe.user) {
            const user = WebApp.initDataUnsafe.user
            setProfilePhoto(user.photo_url || '/default-profile.png') // Set profile photo or fallback image
        }
    }, [])

    return (
        <div className="flex justify-center w-full">
            <div className="fixed top-0 w-full max-w-md px-4 py-3 bg-green-500 cursor-pointer">
                <div className="flex justify-between items-center pl-2">
                    <div className="text-base text-3xl text-white font-medium">CashCraze</div>
                    <Link href="/profile"> {/* Use Link for navigation */}
                        <button className="bg-[#0000000] rounded-full px-2 py-1">
                            {/* Use the profile picture */}
                            <Image
                                src={profilePhoto || '/default-profile.png'} // Fallback to default image if no profile photo is set
                                alt="Profile"
                                className="w-7 h-7 rounded-full object-cover" // Make sure it looks circular
                                width={28}
                                height={28}
                            />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CheckFootprint
