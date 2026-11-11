// The 40 model inputs (PhysioNet 2019 columns). Keys must match the trained model's feature names.
const g = (group, list) => list.split(',').map((s) => {
  const [key, label, unit = ''] = s.split(':');
  return { key, label, unit, group };
});
export const FEATURES = [
  ...g('Vital signs', 'HR:Heart rate:bpm,O2Sat:Oxygen saturation:%,Temp:Temperature:°C,SBP:Systolic BP:mmHg,MAP:Mean arterial pressure:mmHg,DBP:Diastolic BP:mmHg,Resp:Respiratory rate:/min,EtCO2:End-tidal CO₂:mmHg'),
  ...g('Laboratory', 'BaseExcess:Base excess:mmol/L,HCO3:Bicarbonate:mmol/L,FiO2:FiO₂:fraction,pH:pH,PaCO2:PaCO₂:mmHg,SaO2:SaO₂:%,AST:AST:IU/L,BUN:BUN:mg/dL,Alkalinephos:Alkaline phosphatase:IU/L,Calcium:Calcium:mg/dL,Chloride:Chloride:mmol/L,Creatinine:Creatinine:mg/dL,Bilirubin_direct:Direct bilirubin:mg/dL,Glucose:Glucose:mg/dL,Lactate:Lactate:mmol/L,Magnesium:Magnesium:mmol/dL,Phosphate:Phosphate:mg/dL,Potassium:Potassium:mmol/L,Bilirubin_total:Total bilirubin:mg/dL,TroponinI:Troponin I:ng/mL,Hct:Hematocrit:%,Hgb:Hemoglobin:g/dL,PTT:PTT:s,WBC:WBC:10³/µL,Fibrinogen:Fibrinogen:mg/dL,Platelets:Platelets:10³/µL'),
  ...g('Patient', 'Age:Age:years,HospAdmTime:Hospital admission time:h,ICULOS:ICU length of stay:h'),
];
const yn = [['1', 'Yes'], ['0', 'No']];
export const CATEGORICAL = [
  { key: 'Gender', label: 'Gender', opts: [['1', 'Male'], ['0', 'Female']] },
  { key: 'Unit1', label: 'Unit 1 (MICU)', opts: yn },
  { key: 'Unit2', label: 'Unit 2 (SICU)', opts: yn },
];
