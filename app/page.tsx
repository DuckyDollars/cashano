import NavigationBar from '@/components/NavigationBar'
import TabContainer from '@/components/TabContainer'
import TabContainer1 from '@/components/Referral'
import TabContainer2 from '@/components/SaveData'
import TabContainer3 from '@/components/InvestSystem'
import { TabProvider } from '@/contexts/TabContext'

export default function Home() {
  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        <TabContainer />
        <TabContainer1 />
        <TabContainer2 />
        <TabContainer3 />
        <NavigationBar />
      </main>
    </TabProvider>
  )
}