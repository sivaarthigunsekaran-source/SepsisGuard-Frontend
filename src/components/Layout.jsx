import { useState } from 'react';
import { LayoutDashboard, Users, HeartPulse, ClipboardCheck, BarChart3, Info, Menu, X } from 'lucide-react';
import logo from '../assets/logo.svg';
import { backendConfigured } from '../data/api';

const NAV = [
  ['dashboard', 'Dashboard', LayoutDashboard],
  ['patients', 'Patients', Users],
  ['monitoring', 'Monitoring', HeartPulse],
  ['assessment', 'Risk assessment', ClipboardCheck],
  ['reports', 'Reports', BarChart3],
  ['about', 'About', Info],
];

export default function Layout({ page, children }) {
  const [open, setOpen] = useState(false);
  const title = NAV.find((n) => n[0] === page)[1];
  return (
    <div className="app">
      <aside className={open ? 'side open' : 'side'}>
        <div className="brand"><img src={logo} alt="" width="28" height="28" /><span>SepsisGuard</span></div>
        <nav>
          {NAV.map(([k, label, Icon]) => (
            <a key={k} href={`#/${k}`} className={page === k ? 'active' : ''} onClick={() => setOpen(false)}>
              <Icon size={18} />{label}
            </a>
          ))}
        </nav>
        <p className="side-foot">Research prototype.<br />Not for clinical use.</p>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="top">
          <button className="icon-btn menu" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1>{title}</h1>
          <div className="chips">
            <span className="chip amber">Demo data</span>
            <span className="chip">{backendConfigured ? 'Backend URL set' : 'Backend not configured'}</span>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
