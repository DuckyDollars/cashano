import TabContainer from '@/components/Friends'
import NavigationBar from '@/components/NavigationBar'

export default function Home() {
  return (
      <main className="min-h-full bg-black text-white">
        <TabContainer />
        <NavigationBar />
      </main>
  )
}