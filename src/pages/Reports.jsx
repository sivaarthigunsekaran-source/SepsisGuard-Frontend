import { Users, Clock, Activity, Percent } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { patients, history } from '../data/patients';
import { Card, Stat, COLORS, RISKS } from '../components/ui';
import MiniChart from '../components/MiniChart';

const n = patients.length;
const avg = (k) => (patients.reduce((s, p) => s + p[k], 0) / n).toFixed(1);
const ageBins = [['Under 40', 0, 39], ['40–54', 40, 54], ['55–69', 55, 69], ['70+', 70, 200]]
  .map(([name, lo, hi]) => ({ name, count: patients.filter((p) => p.age >= lo && p.age <= hi).length }));
const riskData = RISKS.map((r) => ({ name: r, count: patients.filter((p) => p.risk === r).length }));
const axis = { tick: { fontSize: 11 }, stroke: '#8a99a6' };

function Bars({ data, colors }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
        <CartesianGrid stroke="#E7ECEF" vertical={false} />
        <XAxis dataKey="name" {...axis} /><YAxis allowDecimals={false} {...axis} /><Tooltip />
        <Bar dataKey="count" name="Patients" fill="#287C78" isAnimationActive={false}>
          {colors && data.map((d) => <Cell key={d.name} fill={colors[d.name]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Reports() {
  return (
    <>
      <p className="intro">Statistics calculated from the sample patient list. Historical charts use generated sample data.</p>
      <div className="stats">
        <Stat icon={Users} label="Patients" value={n} />
        <Stat icon={Activity} label="Mean age (years)" value={avg('age')} />
        <Stat icon={Percent} label="Male patients" value={`${Math.round(patients.filter((p) => p.gender === 'Male').length / n * 100)}%`} />
        <Stat icon={Clock} label="Mean hours in ICU" value={avg('icuHours')} />
      </div>
      <div className="grid2">
        <Card title="Risk distribution"><Bars data={riskData} colors={COLORS} /></Card>
        <Card title="Age groups"><Bars data={ageBins} /></Card>
        <Card title="Weekly patients by risk category (sample history)" className="wide">
          <MiniChart data={history} x="week" interval={0} height={230}
            lines={RISKS.map((r) => ({ key: r, color: COLORS[r] }))} />
        </Card>
        <Card title="Risk category by gender" className="wide">
          <div className="table-wrap"><table>
            <thead><tr><th>Risk</th><th>Male</th><th>Female</th><th>Total</th></tr></thead>
            <tbody>{RISKS.map((r) => {
              const m = patients.filter((p) => p.risk === r && p.gender === 'Male').length;
              const f = patients.filter((p) => p.risk === r && p.gender === 'Female').length;
              return <tr key={r}><td>{r}</td><td>{m}</td><td>{f}</td><td>{m + f}</td></tr>;
            })}</tbody>
          </table></div>
        </Card>
      </div>
    </>
  );
}
