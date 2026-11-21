import patients from "../../data/patients.ts"
import type { NewPatientEntry, NonSensitivePatientEntry, PatientEntry } from "../types.ts";
import { v1 as uuid } from 'uuid'

const getNonsentiveEntries = (): NonSensitivePatientEntry[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {
    const id = uuid();
    const newPatientEntry = {
        id: id,
        ...entry
    };

    patients.push(newPatientEntry);
    return newPatientEntry;
};

export default {
    getNonsentiveEntries,
    addPatient
};