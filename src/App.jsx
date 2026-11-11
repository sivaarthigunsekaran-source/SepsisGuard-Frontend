import { lazy, Suspense, useEffect, useState } from 'react';
import Layout from './components/Layout';

// Pages load on demand, so charts only download when a chart page is opened.
const pages = {
  dashboard: lazy(() => import('./pages/Dashboard')),
  patients: lazy(() => import('./pages/Patients')),
  monitoring: lazy(() => import('./pages/Monitoring')),
  assessment: lazy(() => import('./pages/Assessment')),
  reports: lazy(() => import('./pages/Reports')),
  about: lazy(() => import('./pages/About')),
};
const read = () => location.hash.replace(/^#\/?/, '').split('/');

export default function App() {
  const [[name, arg], setRoute] = useState(read);
  useEffect(() => {
    const f = () => setRoute(read());
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  const key = pages[name] ? name : 'dashboard';
  const Page = pages[key];
  return (
    <Layout page={key}>
      <Suspense fallback={<p className="muted">Loading…</p>}><Page arg={arg} /></Suspense>
    </Layout>
  );
}
