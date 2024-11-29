import Header from '@/components/Header'
import TabContainer from '@/components/HomeTab'
import TabContainer2 from '@/components/Referral'
import NavigationBar from '@/components/NavigationBar'

export default function Home() {
  return (
      <main className="min-h-screen bg-black text-white">
        <Header />
        <TabContainer />
        <NavigationBar />
        <TabContainer2 />
      </main>
  )
}