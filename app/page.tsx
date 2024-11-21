import Header from '@/components/Header'
import TabContainer from '@/components/HomeTab'
import NavigationBar from '@/components/NavigationBar'

export default function Home() {
  return (
      <main className="min-h-screen bg-black text-white">
        <Header />
        <TabContainer />
        <NavigationBar />
      </main>
  )
}