import TabContainer from '@/components/About'
import NavigationBar from '@/components/NavigationBar'

export default function Home() {
  return (
      <main className="min-h-screen bg-black text-white">
        <TabContainer />
        <NavigationBar />
      </main>
  )
}