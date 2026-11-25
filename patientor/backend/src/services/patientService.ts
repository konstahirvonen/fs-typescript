import patients from "../../data/patients.ts";
import type { NewPatientEntry, NonSensitivePatientEntry, PatientEntry, Patient, EntryWithoutId, Entry } from "../types.ts";
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

const addEntry = (id: string, entry: EntryWithoutId): Entry => {
    const patient = patients.find(p => p.id === id);

    if (!patient) {
        throw new Error("Patient not found");
    }

    const newEntry = {
        id: uuid(),
        ...entry
    };

    patient.entries.push(newEntry);

    return newEntry;
};

export default {
    getNonsentiveEntries,
    getNonsensitivePatient,
    addPatient,
    addEntry
};