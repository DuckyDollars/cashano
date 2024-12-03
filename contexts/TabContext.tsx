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

    const redirectToPage = (tab: TabType, delay: number) => {
        setTimeout(() => {
            setActiveTab(tab)
        }, delay)
    }

    const isTelegramDesktop = () => {
        return /TelegramDesktop/i.test(navigator.userAgent)
    }

    const isMobileOrTablet = () => {
        return /Mobi|Tablet/i.test(navigator.userAgent)
    }

    useEffect(() => {
        if (isTelegramDesktop() || isMobileOrTablet()) {
            const initData = WebApp.initDataUnsafe;

            if (initData && initData.user) {
                setActiveTab('deposit') // Show the deposit page
                redirectToPage('home', 4000) // Redirect to home after 4 seconds
            } else {
                setActiveTab('about') // Redirect to auth if not authenticated
            }
        } else {
            setActiveTab('about') // For non-Telegram environments, show About page
        }
    }, [])

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
