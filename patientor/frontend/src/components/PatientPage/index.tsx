import { useEffect, useState } from "react"
import { Patient } from "../../types"
import patientService from "../../services/patients";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PatientEntries from "./PatientEntries";

const PatientPage = () => {
    const [patient, setPatient] = useState<Patient>();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchPatient = async () => {
            if (id) {
                const patient = await patientService.getPatient(id);
                setPatient(patient);
            }
        };
        void fetchPatient();
    }, [id]);

    return (
        <div>
            {patient && (
                <Container disableGutters maxWidth={false}>
                    <Typography variant="h4" sx={{ marginBottom: "0.5em", display: "flex", alignItems: "center", gap: 1 }}>
                        {patient.name} 
                        {patient.gender === "male" ? (
                            <MaleIcon fontSize="large" />
                        ) : patient.gender === "female" ? (
                            <FemaleIcon fontSize="large" /> 
                        ) : (
                            <PersonOutlineIcon fontSize="large" />
                        )}
                    </Typography>
                    <Typography>ssn: {patient.ssn}</Typography>
                    <Typography>occupation: {patient.occupation}</Typography>
                    <Typography>date of birth: {patient.dateOfBirth}</Typography>

                    <PatientEntries patient={patient} />
                    
                </Container>
            )}
        </div>
    )
}

export default PatientPage;