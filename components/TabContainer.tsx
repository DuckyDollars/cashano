'use client'

import { useTab } from '@/contexts/TabContext'
import HomeTab from './HomeTab'
import Invest from './InvestTab'
import FriendsTab from './Friends'
import Wallet from './Wallet'
import Profile from './Profile'
import Withdraw from './Withdraw'
import Deposit from './Deposit'
import About from './About'

const TabContainer = () => {
    const { activeTab } = useTab()

    return ( 
        <div className="flex-1 overflow-auto max-w mx-auto bg-gradient-to-t from-green-500 to-teal-500">
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
            <div className={`${activeTab === 'profile' ? 'is-show' : 'is-hide'}`}>
                <Profile />
            </div>
            <div className={`${activeTab === 'withdraw' ? 'is-show' : 'is-hide'}`}>
                <Withdraw />
            </div>
            <div className={`${activeTab === 'deposit' ? 'is-show' : 'is-hide'}`}>
                <Deposit />
            </div>
            <div className={`${activeTab === 'about' ? 'is-show' : 'is-hide'}`}>
                <About />
            </div>
        </div>
    )
}

export default TabContainer