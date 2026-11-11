// Future Flask integration. Set VITE_API_URL (e.g. http://localhost:5000) in a .env file.
// No request is made unless the user submits the Risk Assessment form.
const BASE = import.meta.env.VITE_API_URL;
export const backendConfigured = Boolean(BASE);

// Expected response: { probability: 0-1, threshold: number, risk_category: "Low"|"Moderate"|"High", model: string }
export async function predictRisk(features) {
  if (!BASE) throw new Error('NO_BACKEND');
  const res = await fetch(`${BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features }),
  });
  if (!res.ok) throw new Error(`The server returned status ${res.status}.`);
  return res.json();
}
