import diagnoses from '../../data/diagnoses.ts';
import type { Diagnosis } from '../types.ts';

const getEntries = (): Diagnosis[] => {
  return diagnoses;
};

const addDiagnose = () => {
  return null;
};

export default {
  getEntries,
  addDiagnose
};