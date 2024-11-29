import { useState, useEffect } from 'react'
import { initUtils } from '@telegram-apps/sdk'

interface ReferralSystemProps {
  initData: string
  userId: string
  startParam: string
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ initData, userId, startParam }) => {
  const [referrals, setReferrals] = useState<string[]>([])
  const [referrer, setReferrer] = useState<string | null>(null)

  useEffect(() => {
    const checkReferral = async () => {
      if (startParam && userId) {
        try {
          const response = await fetch('/api/referrals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, referrerId: startParam }),
          })
          if (!response.ok) throw new Error('Failed to save referral')
        } catch (error) {
          console.error('Error saving referral:', error)
        }
      }
    }

    const fetchReferrals = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/referrals?userId=${userId}`)
          if (!response.ok) throw new Error('Failed to fetch referrals')
          const data = await response.json()
          setReferrals(data.referrals)
          setReferrer(data.referrer)
        } catch (error) {
          console.error('Error fetching referrals:', error)
        }
      }
    }

    checkReferral()
    fetchReferrals()
  }, [userId, startParam])


  // The component still performs background tasks but doesn't render anything to the UI
  return null
}

export default ReferralSystem
