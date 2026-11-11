import { Card } from '../components/ui';

export default function About() {
  return (
    <div className="grid2">
      <Card title="SepsisGuard overview">
        <p>SepsisGuard is a final-year academic project on early sepsis risk prediction from structured ICU data. This web application is the user interface for viewing patients, monitoring vital signs and entering clinical values for assessment.</p>
        <p className="note amber">This frontend is not connected to any trained model. All patient data shown is generated sample data. It is a research prototype and not a diagnostic device.</p>
      </Card>
      <Card title="Objectives">
        <ul>
          <li>Predict sepsis risk early from hourly ICU measurements.</li>
          <li>Handle missing clinical values without inventing data.</li>
          <li>Present risk clearly so patients who need attention are easy to find.</li>
          <li>Keep the interface lightweight and ready for a Flask backend.</li>
        </ul>
      </Card>
      <Card title="Methodology" className="wide">
        <ul>
          <li>Data: PhysioNet/CinC Challenge 2019 ICU records (hospital systems A and B, hourly rows).</li>
          <li>Patient-level train, validation and test split, so one patient never appears in two sets.</li>
          <li>Models: XGBoost, LightGBM and CatBoost, combined by weighted averaging.</li>
          <li>Probability calibration with Platt scaling, and a decision threshold chosen on validation data only.</li>
          <li>Models are trained separately in Google Colab. This app does not train or run them.</li>
        </ul>
      </Card>
    </div>
  );
}
