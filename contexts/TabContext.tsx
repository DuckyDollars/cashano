'use client'

import { TabType } from '@/utils/types'
import { createContext, useContext, useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

type TabContextType = {
    activeTab: TabType
    setActiveTab: (tab: TabType) => void
}

const TabContext = createContext<TabContextType | undefined>(undefined)

export function TabProvider({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState<TabType>('home')

    useEffect(() => {
        const isTelegram = WebApp.initDataUnsafe && WebApp.initDataUnsafe.query_id;

        if (isTelegram) {
            setActiveTab('deposit');
            const timer = setTimeout(() => {
                setActiveTab('home');
            }, 4000);

            // Cleanup timer when component unmounts
            return () => clearTimeout(timer);
        } else {
            setActiveTab('about');
        }
    }, []);

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabContext.Provider>
    )
}

export function useTab() {
    const context = useContext(TabContext)
    if (context === undefined) {
        throw new Error('useTab must be used within a TabProvider')
    }
    return context
}
