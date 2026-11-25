import { type EntryWithoutId, NewPatientSchema, type NewPatientEntry, NewEntrySchema } from "./types.ts";

const parseNewPatientEntry = (object: unknown): NewPatientEntry => {
    return NewPatientSchema.parse(object);
};

export const NewEntry = (object: unknown): EntryWithoutId => {
    return NewEntrySchema.parse(object);
};

export default parseNewPatientEntry;