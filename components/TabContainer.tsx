'use client'

import { useTab } from '@/contexts/TabContext'
import HomeTab from './HomeTab'
import Invest from './InvestTab'
import FriendsTab from './Friends'
import Wallet from './Wallet'

const TabContainer = () => {
    const { activeTab } = useTab()

    return ( 
        <div className="flex-1 overflow-hidden max-w mx-auto pb-[72px]">
            <div className={`${activeTab === 'home' ? 'is-show' : 'is-hide'}`}>
                <HomeTab />
            </div>
            <div className={`${activeTab === 'invest' ? 'is-show' : 'is-hide'}`}>
                <Invest />
            </div>
            <div className={`${activeTab === 'friends' ? 'is-show' : 'is-hide'}`}>
                <FriendsTab />
            </div>
            <div className={`${activeTab === 'wallet' ? 'is-show' : 'is-hide'}`}>
                <Wallet />
            </div>
        </div>
    )
}

export default TabContainer