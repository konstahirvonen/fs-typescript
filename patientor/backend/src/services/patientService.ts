import patients from "../../data/patients.ts";
import type { NewPatientEntry, NonSensitivePatientEntry, PatientEntry, Patient } from "../types.ts";
import { v1 as uuid } from 'uuid';

const getNonsentiveEntries = (): NonSensitivePatientEntry[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const getNonsensitivePatient = (id: string): Patient | undefined => {
    return patients.find(patient => patient.id === id);
};

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {
    const id = uuid();
    const newPatient = {
        id: id,
        ...entry,
        entries:[]
    };

    patients.push(newPatient);
    return newPatient;
};

export default {
    getNonsentiveEntries,
    getNonsensitivePatient,
    addPatient
};