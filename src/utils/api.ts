export interface DataRow {
    id: string;
    mrn: string;
    age: number;
    gender: string;
    diagnosis: string;
    treatment: string;
    encounterDate: string;
    labValue: number;
    systolicBP: number;
    diastolicBP: number;
    bmi: string;
  }
  
  export const generateMockData = (count = 50): DataRow[] => {
    const conditions = [
      'Hypertension',
      'Diabetes Type 2',
      'Asthma',
      'Chronic Kidney Disease',
      'Coronary Artery Disease',
      'COPD',
      'Heart Failure',
      'Atrial Fibrillation'
    ];
    const treatments = [
      'Metformin',
      'Lisinopril',
      'Atorvastatin',
      'Albuterol',
      'Insulin',
      'Amlodipine',
      'Metoprolol',
      'Warfarin'
    ];
    const genders = ['Male', 'Female'];
  
    return Array.from({ length: count }, (_, i) => ({
      id: `P${String(i + 1).padStart(3, '0')}`,
      mrn: `MRN${String(i + 1).padStart(3, '0')}`,
      age: Math.floor(Math.random() * 60) + 20,
      gender: genders[Math.floor(Math.random() * genders.length)],
      diagnosis: conditions[Math.floor(Math.random() * conditions.length)],
      treatment: treatments[Math.floor(Math.random() * treatments.length)],
      encounterDate: new Date(2024, 0, 1 + Math.floor(Math.random() * 365))
        .toISOString()
        .split('T')[0],
      labValue: Math.floor(Math.random() * 200) + 50,
      systolicBP: Math.floor(Math.random() * 40) + 110,
      diastolicBP: Math.floor(Math.random() * 20) + 70,
      bmi: (Math.random() * 15 + 20).toFixed(1),
    }));
  };
  