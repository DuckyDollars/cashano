'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Home from '@/icons/Home'
import Invest from '@/icons/invest'
import Wallet from '@/icons/Wallet'
import Friends from '@/icons/Friends'

const NavigationBar = () => {
    const pathname = usePathname() // Get the current path

    const tabs = [
        { id: 'home', label: 'Home', Icon: Home, href: '/' },
        { id: 'invest', label: 'Invest', Icon: Invest, href: '/invest' },
        { id: 'friends', label: 'Friends', Icon: Friends, href: '/friends' },
        { id: 'wallet', label: 'Wallet', Icon: Wallet, href: '/wallet' },
    ]

    return (
        <div className="flex justify-center w-full">
            <div className="fixed bottom-0 bg-white border-t border-gray-800 w-full max-w-md">
                <div className="flex justify-between px-4 py-2">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href // Check if the current path matches the tab href
                        return (
                            <Link key={tab.id} href={tab.href}>
                                <button className="flex flex-col items-center">
                                    <tab.Icon
                                        className={`w-10 h-10 ${isActive ? 'text-green-500' : 'text-black'}`}
                                    />
                                    <span
                                        className={`text-xs font-medium ${isActive ? 'text-green-500' : 'text-black'}`}
                                    >
                                        {tab.label}
                                    </span>
                                </button>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default NavigationBar

