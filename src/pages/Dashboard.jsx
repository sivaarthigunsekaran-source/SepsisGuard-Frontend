import { useMemo } from 'react';
import { Users, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { patients, activity } from '../data/patients';
import { Card, Stat, RiskBadge, COLORS, RISKS } from '../components/ui';

export default function Dashboard() {
  const counts = useMemo(() => Object.fromEntries(RISKS.map((r) => [r, patients.filter((p) => p.risk === r).length])), []);
  const data = RISKS.map((r) => ({ name: r, value: counts[r] }));
  return (
    <>
      <p className="intro">Overview of the sample patient list. Risk categories are demonstration labels, not model output.</p>
      <div className="stats">
        <Stat icon={Users} label="Total patients" value={patients.length} />
        <Stat icon={AlertTriangle} tone="high" label="High risk" value={counts.High} />
        <Stat icon={AlertCircle} tone="mod" label="Moderate risk" value={counts.Moderate} />
        <Stat icon={CheckCircle2} tone="low" label="Low risk" value={counts.Low} />
      </div>
      <div className="grid2">
        <Card title="Risk distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={88} isAnimationActive={false}>
                {data.map((d) => <Cell key={d.name} fill={COLORS[d.name]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Recent patient activity">
          <ul className="feed">
            {activity.map((a) => (
              <li key={a.id}>
                <a href={`#/patients/${a.id}`}>{a.id}</a><span>{a.event}</span>
                <RiskBadge risk={a.risk} /><span className="muted">{a.ago}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
