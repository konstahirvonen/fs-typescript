import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from "react";
import { Entry, EntryWithoutId, HealthCheckRating, Patient, Diagnosis } from "../../types";

import patientService from "../../services/patients";
import diagnoseService from "../../services/diagnoses";
import axios from "axios";

interface NewEntryProps {
    patientId: string;
    entries: Entry[];
    setPatient: Dispatch<SetStateAction<Patient | undefined>>;
}

interface BaseForm {
    date: string;
    description: string;
    specialist: string;
    diagnosisCodes: string[];
}

interface HealhtCheckForm extends BaseForm {
    type: "HealthCheck";
    healthCheckRating: string;
}

interface OccupationalHealthCareForm extends BaseForm {
    type: "OccupationalHealthCare";
    employerName: string;
    sickLeave: {
        startDate: string;
        endDate: string;
    },
}

interface HospitalForm extends BaseForm {
    type: "Hospital";
    discharge: {
        date: string;
        criteria: string;
    },
}

type EntryForm = HealhtCheckForm | OccupationalHealthCareForm | HospitalForm;

const initialValues = (type: EntryForm["type"]): EntryForm => {
    switch (type) {
        case "HealthCheck":
            return {
                type: "HealthCheck",
                date: "",
                description: "",
                specialist: "",
                healthCheckRating: "0",
                diagnosisCodes: []
            }
        case "OccupationalHealthCare":
            return {
                type: "OccupationalHealthCare",
                date: "",
                description: "",
                specialist: "",
                employerName: "",
                diagnosisCodes: [],
                sickLeave: {
                    startDate: "",
                    endDate: ""
                },
            }
        case "Hospital":
            return {
                type: "Hospital",
                date: "",
                description: "",
                specialist: "",
                diagnosisCodes: [],
                discharge: {
                    date: "",
                    criteria: "",
                },
            };
    }
};

const NewEntry = ({ patientId, entries, setPatient }: NewEntryProps) => {
    const [error, setError] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<EntryForm>(initialValues("HealthCheck"));
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

    useEffect(() => {
        const fetchDiagnoses = async () => {
            const data = await diagnoseService.getAll();
            setDiagnoses(data);
        };
        void fetchDiagnoses();
    }, [])

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
            setError(null);
            }, 5000);

            return () => clearTimeout(timeout);
        }
        }, [error]);

    const addEntry = async (e: SyntheticEvent) => {
        e.preventDefault();

        let newEntry: EntryWithoutId;

        const base = {
            date: formValues.date,
            description: formValues.description,
            specialist: formValues.specialist,
            diagnosisCodes: formValues.diagnosisCodes
        };

        switch (formValues.type) {
            case "HealthCheck":
                newEntry = {
                    ...base,
                    type: "HealthCheck",
                    healthCheckRating: Number(formValues.healthCheckRating) as HealthCheckRating
                };
                break;
            case "OccupationalHealthCare":
                newEntry = {
                    ...base,
                    type: "OccupationalHealthcare",
                    employerName: formValues.employerName,
                    sickLeave:
                        formValues.sickLeave.startDate && formValues.sickLeave.endDate
                            ? formValues.sickLeave
                            : undefined
                };
                break;
            case "Hospital":
                newEntry = {
                    ...base,
                    type: "Hospital",
                    discharge: formValues.discharge
                };
                break;
        }

        try {
            const addedEntry = await patientService.addEntry(patientId, newEntry);

            setPatient(prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    entries:[...entries, addedEntry]
                };
            });

            setFormValues(initialValues(formValues.type));
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const resError = error.response?.data?.error;

                if (Array.isArray(resError)) {
                    setError(
                        resError.map(issue => `${issue.field}: ${issue.message}`)
                        .join("\n")
                    );
                } else {
                    setError(resError || error.message)
                }
            } else {
                setError("Unexpected error occured");
            }
        }
    };

    const clearForm = () => {
        setFormValues(initialValues(formValues.type));
    };

    return (
        <div>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                )}
            <Box sx={{ border: "2px dotted", borderRadius: 2, padding: 2, marginBottom: 2 }}>
                <Typography variant="h5">New Entry:</Typography>

                <Box component="form" onSubmit={addEntry} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

                    <FormControl>
                        <InputLabel>Entry type</InputLabel>
                        <Select label="Entry type" value={formValues.type} onChange={e => setFormValues(initialValues(e.target.value as EntryForm["type"]))}>
                            <MenuItem value="HealthCheck">Health Check</MenuItem>
                            <MenuItem value="OccupationalHealthCare">Occupational Healthcare</MenuItem>
                            <MenuItem value="Hospital">Hospital</MenuItem>
                        </Select>
                    </FormControl>
      
                    <TextField
                        type="date"
                        label="Date"
                        required
                        value={formValues.date}
                        onChange={(e) => setFormValues({ ...formValues, date: e.target.value })}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                                    
                    <TextField 
                        label="Description"
                        required
                        value={formValues.description}
                        onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    />
                                    
                    <TextField 
                        label="Specialist"
                        required
                        value={formValues.specialist}
                        onChange={(e) => setFormValues({ ...formValues, specialist: e.target.value })}
                    />                    

                    <FormControl>
                        <InputLabel>Diagnosis Codes</InputLabel>
                        <Select
                            multiple
                            value={formValues.diagnosisCodes}
                            onChange={(e) => {
                                const value = e.target.value; 
                                setFormValues({ 
                                    ...formValues, diagnosisCodes: typeof value === "string" ? value.split(",") : value 
                                });
                            }}
                        >
                            {diagnoses.map(diagnose => (
                                <MenuItem key={diagnose.code} value={diagnose.code}>{diagnose.code}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    {formValues.type === "HealthCheck" && (
                        <FormControl>
                            <InputLabel>Health Check Rating</InputLabel>
                            <Select label="Health Check Rating" value={formValues.healthCheckRating} onChange={(e) => setFormValues({ ...formValues, healthCheckRating: e.target.value })}>
                                <MenuItem value="0">0 - Healthy</MenuItem>
                                <MenuItem value="1">1 - Low Risk</MenuItem>
                                <MenuItem value="2">2 - High Risk</MenuItem>
                                <MenuItem value="3">3 - Critical Risk</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    {formValues.type === "OccupationalHealthCare" && (
                        <>
                            <TextField
                                label="Employer name"
                                required
                                value={formValues.employerName}
                                onChange={(e) => setFormValues({ ...formValues, employerName: e.target.value })}
                            />
                            <TextField
                                type="date"
                                label="Start date"
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={formValues.sickLeave.startDate}
                                onChange={(e) => setFormValues({
                                    ...formValues,
                                    sickLeave: { ...formValues.sickLeave, startDate: e.target.value }
                                })}
                            />
                            <TextField
                                type="date"
                                label="End date"
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={formValues.sickLeave.endDate}
                                onChange={(e) => setFormValues({
                                    ...formValues,
                                    sickLeave: { ...formValues.sickLeave, endDate: e.target.value }
                                })}
                            />
                        </>
                    )}

                    {formValues.type === "Hospital" && (
                        <>
                            <TextField
                                type="date"
                                label="Discharge date"
                                slotProps={{ inputLabel: { shrink: true } }}
                                required
                                value={formValues.discharge.date}
                                onChange={(e) => setFormValues({
                                    ...formValues,
                                    discharge: { ...formValues.discharge, date: e.target.value }
                                })}
                            />
                            <TextField
                                label="Discharge criteria"
                                required
                                value={formValues.discharge.criteria}
                                onChange={(e) => setFormValues({
                                    ...formValues,
                                    discharge: { ...formValues.discharge, criteria: e.target.value }
                                })}
                            />
                        </>
                    )}

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="contained" type="submit">Add New Entry</Button>
                        <Button variant="outlined" onClick={clearForm}>Cancel</Button>
                    </Box>

                </Box>
            </Box>
        </div>
    )
}

export default NewEntry;