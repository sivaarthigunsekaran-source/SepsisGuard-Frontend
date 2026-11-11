import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Small reusable line chart. Animation is off to keep rendering cheap.
export default function MiniChart({ data, lines, domain, unit, x = 't', interval = 5, height = 170 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
        <CartesianGrid stroke="#E7ECEF" vertical={false} />
        <XAxis dataKey={x} tick={{ fontSize: 11 }} interval={interval} stroke="#8a99a6" />
        <YAxis tick={{ fontSize: 11 }} domain={domain || ['auto', 'auto']} stroke="#8a99a6" />
        <Tooltip formatter={(v) => (unit ? `${v} ${unit}` : v)} />
        {lines.map((l) => (
          <Line key={l.key} dataKey={l.key} name={l.name || l.key} stroke={l.color} strokeWidth={2} dot={false} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
