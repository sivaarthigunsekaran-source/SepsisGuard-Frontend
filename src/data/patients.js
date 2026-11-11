// SAMPLE DATA ONLY. Synthetic patients generated locally for layout purposes.
// Risk categories here are demonstration labels, NOT model predictions.
const rng = (seed) => { let s = seed; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; };
const WARDS = ['ICU-A', 'ICU-B', 'HDU', 'Step-down'];

export const patients = (() => {
  const r = rng(42);
  return Array.from({ length: 60 }, (_, i) => {
    const x = r();
    return {
      id: `SG-${1001 + i}`,
      age: Math.round(25 + r() * 60),
      gender: r() < 0.5 ? 'Male' : 'Female',
      risk: x < 0.18 ? 'High' : x < 0.45 ? 'Moderate' : 'Low',
      ward: WARDS[Math.floor(r() * 4)],
      icuHours: 4 + Math.floor(r() * 120),
    };
  });
})();

const BASE = {
  High: { hr: 108, spo2: 91, temp: 38.4, sbp: 96, dbp: 56, rr: 25 },
  Moderate: { hr: 94, spo2: 94, temp: 37.7, sbp: 110, dbp: 67, rr: 20 },
  Low: { hr: 76, spo2: 97, temp: 36.9, sbp: 122, dbp: 77, rr: 15 },
};
export function vitalsFor(p) {
  const r = rng(+p.id.slice(3));
  const b = BASE[p.risk];
  const n = (s) => (r() - 0.5) * s;
  return Array.from({ length: 24 }, (_, i) => {
    const d = p.risk === 'Low' ? 0 : (i - 12) / 12;
    return {
      t: i === 23 ? 'Now' : `-${23 - i}h`,
      hr: Math.round(b.hr + d * 4 + n(8)),
      spo2: Math.min(100, Math.round(b.spo2 - d + n(2))),
      temp: +(b.temp + d * 0.2 + n(0.4)).toFixed(1),
      sbp: Math.round(b.sbp - d * 4 + n(8)),
      dbp: Math.round(b.dbp + n(6)),
      rr: Math.round(b.rr + d * 2 + n(3)),
    };
  });
}

const LABS = [
  ['Lactate', 'mmol/L', 0.5, 2.0, { High: 3.4, Moderate: 2.2, Low: 1.2 }],
  ['WBC', '10³/µL', 4, 11, { High: 15.8, Moderate: 12.1, Low: 7.5 }],
  ['Creatinine', 'mg/dL', 0.6, 1.2, { High: 1.9, Moderate: 1.3, Low: 0.9 }],
  ['Platelets', '10³/µL', 150, 400, { High: 110, Moderate: 175, Low: 240 }],
  ['Total bilirubin', 'mg/dL', 0.2, 1.2, { High: 2.1, Moderate: 1.1, Low: 0.7 }],
  ['Glucose', 'mg/dL', 70, 140, { High: 168, Moderate: 146, Low: 104 }],
];
export function labsFor(p) {
  const r = rng(+p.id.slice(3) + 7);
  return LABS.map(([name, unit, lo, hi, b]) => {
    const value = +(b[p.risk] * (1 + (r() - 0.5) * 0.1)).toFixed(1);
    return { name, unit, range: `${lo}–${hi}`, value, flag: value < lo ? 'Low' : value > hi ? 'High' : 'Normal' };
  });
}

const EVENTS = ['Vitals updated', 'Lab result added', 'Ward transfer', 'Admitted to ICU', 'Observation note added'];
export const activity = patients.filter((_, i) => i % 7 === 0).slice(0, 8)
  .map((p, i) => ({ id: p.id, risk: p.risk, event: EVENTS[i % 5], ago: `${(i + 1) * 7} min ago` }));

export const history = (() => {
  const r = rng(9);
  return Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`, High: Math.round(6 + r() * 6), Moderate: Math.round(14 + r() * 8), Low: Math.round(30 + r() * 12),
  }));
})();
