# SepsisGuard – Early Sepsis Prediction and Patient Monitoring System (frontend)

React + Vite frontend. Plain CSS, Recharts, Lucide icons. No backend is needed to run it.

## Run
Requires Node.js 18 or newer.
```
npm install
npm run dev
```
Open the address printed in the terminal (usually http://localhost:5173). Build with `npm run build`.

## Important
- All patients, vitals, labs and history are **generated sample data** (`src/data/patients.js`).
- Risk categories in the tables are demonstration labels, **not model predictions**.
- The app is **not connected to any model**. The Risk Assessment page shows a result only after a backend answers. The "sample layout" is clearly marked as demonstration.

## Structure
```
src/components  Layout, shared UI, MiniChart
src/pages       Dashboard, Patients, Monitoring, Assessment, Reports, About (lazy loaded)
src/data        sample data, 40 model input definitions, api.js
src/styles      app.css
src/assets      logo
```
Routing uses the URL hash (`#/patients/SG-1001`), so no router package is needed.

## Connecting Flask later
1. Create `.env` in the project root: `VITE_API_URL=http://localhost:5000`, then restart `npm run dev`.
2. Enable CORS in Flask (`flask-cors`).
3. Provide `POST /predict`. The frontend sends `{"features": {"HR": 88, "Temp": null, ...}}` with all 40 keys (`null` = missing; see `src/data/features.js`) and expects:
```
{"probability": 0.0-1.0, "threshold": 0.62, "risk_category": "Low|Moderate|High", "model": "name"}
```
Minimal sketch:
```python
@app.post("/predict")
def predict():
    f = request.get_json()["features"]
    row = pd.DataFrame([[f.get(n) for n in FEATURE_NAMES]], columns=FEATURE_NAMES).astype(float)  # None -> NaN
    p = float(your_calibrated_probability(row))   # load your saved models and Platt scaler here
    return jsonify(probability=p, threshold=THRESHOLD, risk_category=to_category(p), model="...")
```
Use the same feature order your saved model expects. To replace sample patients, edit `src/data/patients.js` or add fetch calls in `api.js`.

## Performance notes
System fonts (no downloads), lazy-loaded pages, separate chart bundle, chart animations off, four runtime dependencies, and no network calls until the assessment form is submitted.
