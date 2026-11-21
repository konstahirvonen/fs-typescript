import { NewEntrySchema, type NewPatientEntry } from "./types.ts";

const parseNewPatientEntry = (object: unknown): NewPatientEntry => {
    return NewEntrySchema.parse(object);
};

export default parseNewPatientEntry;