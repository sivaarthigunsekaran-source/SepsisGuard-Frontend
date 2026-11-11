import { useState } from 'react';
import { FEATURES, CATEGORICAL } from '../data/features';
import { predictRisk } from '../data/api';
import { Card, RiskBadge } from '../components/ui';

const GROUPS = [...new Set(FEATURES.map((f) => f.group))];
const SAMPLE = { probability: 0.47, threshold: 0.5, risk_category: 'Moderate', model: 'Sample layout only' };

function Result({ r, demo }) {
  return (
    <div className={`result ${demo ? 'demo' : 'live'}`}>
      <div className="tag">{demo ? 'Demonstration only: sample values, not a model prediction' : 'Prediction returned by the backend model'}</div>
      <div className="res-row">
        <div><span className="muted">Risk score</span><strong className="score">{(r.probability * 100).toFixed(1)}%</strong></div>
        <div><span className="muted">Decision threshold</span><strong>{r.threshold}</strong></div>
        <div><span className="muted">Category</span><RiskBadge risk={r.risk_category} /></div>
      </div>
      <p className="muted small">Model: {r.model}</p>
    </div>
  );
}

export default function Assessment() {
  const [v, setV] = useState({});
  const [s, setS] = useState({ status: 'idle' });
  const [preview, setPreview] = useState(false);
  const set = (k, x) => setV((o) => ({ ...o, [k]: x }));
  const filled = Object.values(v).filter((x) => x !== '' && x != null).length;
  const total = FEATURES.length + CATEGORICAL.length;

  const submit = async (e) => {
    e.preventDefault();
    const features = {};
    [...FEATURES, ...CATEGORICAL].forEach(({ key }) => { features[key] = v[key] === '' || v[key] == null ? null : Number(v[key]); });
    setS({ status: 'loading' });
    try { setS({ status: 'ok', result: await predictRisk(features) }); }
    catch (err) { setS({ status: err.message === 'NO_BACKEND' ? 'offline' : 'error', message: err.message }); }
  };

  return (
    <form onSubmit={submit} className="assess">
      <div>
        <p className="intro">Enter the measurements that are available. Blank fields are sent as missing values.</p>
        {GROUPS.map((grp) => (
          <Card key={grp} title={grp}>
            <div className="fields">
              {FEATURES.filter((f) => f.group === grp).map((f) => (
                <label key={f.key}>{f.label}{f.unit && <small> ({f.unit})</small>}
                  <input type="number" step="any" value={v[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
                </label>
              ))}
              {grp === 'Patient' && CATEGORICAL.map((c) => (
                <label key={c.key}>{c.label}
                  <select value={v[c.key] ?? ''} onChange={(e) => set(c.key, e.target.value)}>
                    <option value="">Unknown</option>{c.opts.map(([val, t]) => <option key={val} value={val}>{t}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <aside className="result-col">
        <Card title="Assessment result">
          <p className="muted small">{filled} of {total} fields entered</p>
          <div className="btns">
            <button className="btn" type="submit" disabled={s.status === 'loading'}>{s.status === 'loading' ? 'Running…' : 'Run assessment'}</button>
            <button className="btn ghost" type="button" onClick={() => { setV({}); setS({ status: 'idle' }); }}>Clear form</button>
          </div>
          {s.status === 'idle' && <p className="muted">No result yet. Fill in the form and run the assessment.</p>}
          {s.status === 'offline' && <p className="note amber">The prediction backend is not connected, so no prediction was produced. Set VITE_API_URL once the Flask API is running.</p>}
          {s.status === 'error' && <p className="note red">The request failed: {s.message}</p>}
          {s.status === 'ok' && <Result r={s.result} />}
        </Card>
        <Card title="Result layout preview">
          <button className="btn ghost" type="button" onClick={() => setPreview(!preview)}>{preview ? 'Hide sample layout' : 'Show sample layout'}</button>
          {preview && <Result r={SAMPLE} demo />}
        </Card>
        <p className="muted small">Research prototype. Results must not be used for clinical decisions.</p>
      </aside>
    </form>
  );
}
