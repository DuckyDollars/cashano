import NavigationBar from '@/components/NavigationBar'
import TabContainer from '@/components/TabContainer'
import { TabProvider } from '@/contexts/TabContext'

export default function Home() {
  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  )
}