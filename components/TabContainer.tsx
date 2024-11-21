'use client'

import { useTab } from '@/contexts/TabContext'
import HomeTab from './HomeTab'
import Profile from './Profile'
import Invest from './InvestTab'
import Wallet from './Wallet'
import Friends from './Friend'
import Crypto from './Crypto'
import Stock from './Stock'
import Golden from './Golden'
import Diamond from './Diamond'

const TabContainer = () => {
    const { activeTab } = useTab()

    return (
        <div className="flex-1 overflow-hidden max-w-md mx-auto pt-[44px] pb-[72px]">
            <div className={`${activeTab === 'home' ? 'is-show' : 'is-hide'}`}>
                <HomeTab />
            </div>
            <div className={`${activeTab === 'profile' ? 'is-show' : 'is-hide'}`}>
                <Profile />
            </div>
            <div className={`${activeTab === 'invest' ? 'is-show' : 'is-hide'}`}>
                <Invest />
            </div>
            <div className={`${activeTab === 'wallet' ? 'is-show' : 'is-hide'}`}>
                <Wallet />
            </div>
            <div className={`${activeTab === 'friends' ? 'is-show' : 'is-hide'}`}>
                <Friends />
            </div>
            <div className={`${activeTab === 'crypto' ? 'is-show' : 'is-hide'}`}>
                <Crypto />
            </div>
            <div className={`${activeTab === 'stock' ? 'is-show' : 'is-hide'}`}>
                <Stock />
            </div>
            <div className={`${activeTab === 'golden' ? 'is-show' : 'is-hide'}`}>
                <Golden />
            </div>
            <div className={`${activeTab === 'diamond' ? 'is-show' : 'is-hide'}`}>
                <Diamond />
            </div>
        </div>
    )
}

export default TabContainer