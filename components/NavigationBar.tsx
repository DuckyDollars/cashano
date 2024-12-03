'use client'

import { useTab } from '@/contexts/TabContext'
import Wallet from '@/icons/Wallet'
import Friends from '@/icons/Friends'
import Home from '@/icons/Home'
import Invest from '@/icons/invest'
import { TabType } from '@/utils/types'

const NavigationBar = () => {
    const { activeTab, setActiveTab } = useTab()

    const tabs: { id: TabType; label: string; Icon: React.FC<{ className?: string }> }[] = [
        { id: 'home', label: 'Home', Icon: Home },
        { id: 'invest', label: 'Invest', Icon: Invest },
        { id: 'friends', label: 'Friends', Icon: Friends },
        { id: 'wallet', label: 'Earn', Icon: Wallet },
    ]

    return (
        <div className="flex justify-center w-full">
            <div className="fixed bottom-0 bg-white border-t border-gray-800 w-full max-w-md">
                <div className="flex justify-between px-4 py-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center`}
                            >
                                <tab.Icon
                                    className={`w-10 h-10 ${isActive ? 'text-green-500' : 'text-black'
                                        }`}
                                />
                                <span
                                    className={`text-xs font-medium ${isActive ? 'text-green-500' : 'text-black'
                                        }`}
                                >
                                    {tab.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default NavigationBar