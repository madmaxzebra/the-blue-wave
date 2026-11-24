import './TabBar.css';
import type { TabId } from './App';

const TAB_ICONS: Record<TabId, string> = {
  home:     '🏠',
  fashion:  '👗',
  homes:    '🏡',
  taste:    '🍽️',
  magazine: '📖',
  more:     '☰',
};

interface Tab {
  id: TabId;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  active: TabId;
  onChange: (id: TabId) => void;
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <nav className="tab-bar" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          className={`tab-item${active === tab.id ? ' tab-item--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon">{TAB_ICONS[tab.id]}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
