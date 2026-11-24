import { useState } from 'react';
import './App.css';
import { TabBar } from './TabBar';
import { HomeTab } from './tabs/HomeTab';
import { FashionTab } from './tabs/FashionTab';
import { HomesTab } from './tabs/HomesTab';
import { TasteTab } from './tabs/TasteTab';
import { MagazineTab } from './tabs/MagazineTab';
import { MoreTab } from './tabs/MoreTab';

export type TabId = 'home' | 'fashion' | 'homes' | 'taste' | 'magazine' | 'more';

const TABS: { id: TabId; label: string }[] = [
  { id: 'home',     label: 'Home' },
  { id: 'fashion',  label: 'Fashion' },
  { id: 'homes',    label: 'Homes' },
  { id: 'taste',    label: 'Taste' },
  { id: 'magazine', label: 'Magazine' },
  { id: 'more',     label: 'More' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  return (
    <div className="app-shell">
      <div className="screen">
        {activeTab === 'home'     && <HomeTab />}
        {activeTab === 'fashion'  && <FashionTab />}
        {activeTab === 'homes'    && <HomesTab />}
        {activeTab === 'taste'    && <TasteTab />}
        {activeTab === 'magazine' && <MagazineTab />}
        {activeTab === 'more'     && <MoreTab />}
      </div>
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
