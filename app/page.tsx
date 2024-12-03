import WebApp from '@twa-dev/sdk';
import NavigationBar from '@/components/NavigationBar';
import TabContainer from '@/components/TabContainer';
import TabContainer1 from '@/components/Referral';
import TabContainer2 from '@/components/SaveData';
import TabContainer3 from '@/components/InvestSystem';
import { TabProvider } from '@/contexts/TabContext';

export default function Home() {
  // Apply colors using WebApp methods from the @twa-dev/sdk
  WebApp.themeParams.bg_color = '#48bb78';
  WebApp.setHeaderColor('#48bb78');
  WebApp.setBackgroundColor('#48bb78');

  if (WebApp.setBottomBarColor) {
    WebApp.setBottomBarColor('#000000'); // Ensure compatibility with Bot API 7.10+
  }

  return (
    <TabProvider>
      <TabContainer1 />
      <TabContainer2 />
      <TabContainer3 />
      <main className="min-h-screen bg-black text-white">
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  );
}
