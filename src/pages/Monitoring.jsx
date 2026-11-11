import { useEffect, useMemo, useState } from 'react';
import { patients, vitalsFor, labsFor } from '../data/patients';
import { Card, RiskBadge } from '../components/ui';
import MiniChart from '../components/MiniChart';

export default function Monitoring({ arg }) {
  const [id, setId] = useState(patients.some((x) => x.id === arg) ? arg : patients[0].id);
  useEffect(() => { if (patients.some((x) => x.id === arg)) setId(arg); }, [arg]);
  const p = patients.find((x) => x.id === id);
  const v = useMemo(() => vitalsFor(p), [p]);
  const labs = useMemo(() => labsFor(p), [p]);
  const l = v.at(-1);
  const tiles = [
    ['Heart rate', l.hr, 'bpm', l.hr < 60 || l.hr > 100],
    ['Oxygen saturation', l.spo2, '%', l.spo2 < 94],
    ['Temperature', l.temp, '°C', l.temp < 36 || l.temp > 38],
    ['Blood pressure', `${l.sbp}/${l.dbp}`, 'mmHg', l.sbp < 90],
    ['Respiratory rate', l.rr, '/min', l.rr > 20],
  ];
  return (
    <>
      <div className="filters">
        <select value={id} onChange={(e) => setId(e.target.value)} aria-label="Select patient">
          {patients.map((x) => <option key={x.id} value={x.id}>{x.id}: {x.age}y {x.gender}, {x.ward}</option>)}
        </select>
        <RiskBadge risk={p.risk} />
        <span className="muted small">Sample values for layout. Live data will come from the backend.</span>
      </div>
      <div className="stats five">
        {tiles.map(([k, val, u, bad]) => (
          <div key={k} className={`tile ${bad ? 'warn' : ''}`}>
            <span className="muted">{k}</span><strong>{val} <small>{u}</small></strong>
          </div>
        ))}
      </div>
      <div className="grid2">
        <Card title="Heart rate (bpm)"><MiniChart data={v} lines={[{ key: 'hr', color: '#C94C4C' }]} /></Card>
        <Card title="Oxygen saturation (%)"><MiniChart data={v} domain={[85, 100]} lines={[{ key: 'spo2', color: '#287C78' }]} /></Card>
        <Card title="Temperature (°C)"><MiniChart data={v} domain={[35, 40]} lines={[{ key: 'temp', color: '#D69A36' }]} /></Card>
        <Card title="Blood pressure (mmHg)"><MiniChart data={v} lines={[{ key: 'sbp', name: 'Systolic', color: '#19324A' }, { key: 'dbp', name: 'Diastolic', color: '#287C78' }]} /></Card>
        <Card title="Respiratory rate (/min)"><MiniChart data={v} lines={[{ key: 'rr', color: '#19324A' }]} /></Card>
        <Card title="Laboratory measurements">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Test</th><th>Value</th><th>Reference</th><th>Flag</th></tr></thead>
              <tbody>
                {labs.map((x) => (
                  <tr key={x.name}><td>{x.name}</td><td>{x.value} {x.unit}</td><td>{x.range}</td>
                    <td><span className={`flag ${x.flag.toLowerCase()}`}>{x.flag}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
