import { useMemo, useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { patients, vitalsFor } from '../data/patients';
import { Card, RiskBadge } from '../components/ui';

export default function Patients({ arg }) {
  const p = patients.find((x) => x.id === arg);
  return p ? <Profile p={p} /> : <List />;
}

function List() {
  const [q, setQ] = useState('');
  const [risk, setRisk] = useState('All');
  const [gender, setGender] = useState('All');
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return patients.filter((p) => (risk === 'All' || p.risk === risk) && (gender === 'All' || p.gender === gender)
      && `${p.id} ${p.ward}`.toLowerCase().includes(s));
  }, [q, risk, gender]);
  return (
    <Card title={`Patient records (${rows.length})`}>
      <div className="filters">
        <label className="search"><Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by patient ID or ward" aria-label="Search patients" />
        </label>
        <select value={risk} onChange={(e) => setRisk(e.target.value)} aria-label="Filter by risk">
          {['All', 'High', 'Moderate', 'Low'].map((o) => <option key={o} value={o}>{o === 'All' ? 'All risk levels' : o}</option>)}
        </select>
        <select value={gender} onChange={(e) => setGender(e.target.value)} aria-label="Filter by gender">
          {['All', 'Male', 'Female'].map((o) => <option key={o} value={o}>{o === 'All' ? 'All genders' : o}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Patient ID</th><th>Age</th><th>Gender</th><th>Ward</th><th>Hours in ICU</th><th>Risk (demo)</th></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="click" onClick={() => { location.hash = `#/patients/${p.id}`; }}>
                <td><a href={`#/patients/${p.id}`}>{p.id}</a></td><td>{p.age}</td><td>{p.gender}</td>
                <td>{p.ward}</td><td>{p.icuHours}</td><td><RiskBadge risk={p.risk} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="empty">No patients match these filters. Clear the search or choose “All”.</p>}
      </div>
    </Card>
  );
}

function Profile({ p }) {
  const v = useMemo(() => vitalsFor(p).at(-1), [p]);
  const info = [['Age', `${p.age} years`], ['Gender', p.gender], ['Ward', p.ward], ['Hours in ICU', p.icuHours]];
  const vit = [['Heart rate', `${v.hr} bpm`], ['Oxygen saturation', `${v.spo2} %`], ['Temperature', `${v.temp} °C`], ['Blood pressure', `${v.sbp}/${v.dbp} mmHg`], ['Respiratory rate', `${v.rr} /min`]];
  return (
    <>
      <a href="#/patients" className="back"><ArrowLeft size={16} /> Back to patient list</a>
      <div className="grid2">
        <Card title={`Patient ${p.id}`} right={<RiskBadge risk={p.risk} />}>
          <dl className="kv">{info.map(([k, x]) => <div key={k}><dt>{k}</dt><dd>{x}</dd></div>)}</dl>
          <p className="muted small">Risk category is a demonstration label, not a model prediction.</p>
        </Card>
        <Card title="Latest vitals (sample)" right={<a href={`#/monitoring/${p.id}`}>Open monitoring</a>}>
          <dl className="kv">{vit.map(([k, x]) => <div key={k}><dt>{k}</dt><dd>{x}</dd></div>)}</dl>
        </Card>
      </div>
    </>
  );
}
