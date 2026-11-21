import diagnoses from '../../data/diagnoses.ts';
import type { DiagnoseEntry } from '../types.ts';

const getEntries = (): DiagnoseEntry[] => {
  return diagnoses;
};

const addDiagnose = () => {
  return null;
};

export default {
  getEntries,
  addDiagnose
};