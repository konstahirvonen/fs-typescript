import { Container, List, ListItem, ListItemText, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import diagnoseService from "../../services/diagnoses";
import { Diagnosis, Patient, Entry } from "../../types";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Props {
    patient: Patient;  
}

interface EntryDetailsProps {
    entry: Entry;
    diagnoses: Diagnosis[] | undefined;
}

interface DiagnosisInfoProps {
  codes: string[] | undefined;
  diagnoses: Diagnosis[] | undefined;
}

const DiagnosisInfo = ({ codes, diagnoses }: DiagnosisInfoProps) => (
  <List sx={{ listStyleType: "disc", pl: 2 }}>
    {codes?.map(code => {
      const diagnosis = diagnoses?.find(d => d.code === code);

      return (
        <ListItem key={code} sx={{ display: "list-item", py: 0 }}>
          <ListItemText primary={`${code} ${diagnosis?.name ?? ""}`} />
        </ListItem>
      );
    })}
  </List>
);

const EntryDetails = ({ entry, diagnoses }: EntryDetailsProps ) => {
    switch (entry.type) {
        case "HealthCheck":
            return (
                <div>
                    <Container disableGutters maxWidth={false} sx={{ border: "1px solid", borderRadius: 2, padding: 2, marginBottom: 2 }}>
                        <Typography>{entry.date} <MedicalServicesIcon></MedicalServicesIcon> </Typography>
                        <Typography>{entry.description}</Typography>
                        <FavoriteIcon
                            sx={{
                                color:
                                entry.healthCheckRating === 0 ? "green" :
                                entry.healthCheckRating === 1 ? "yellow" :
                                entry.healthCheckRating === 2 ? "red" :
                                "red"
                            }}
                        />
                        <Typography>diagnose by {entry.specialist}</Typography>
                        <DiagnosisInfo codes={entry.diagnosisCodes} diagnoses={diagnoses} />
                    </Container>
                </div>
            );
        case "OccupationalHealthcare":
            return (
                <div>
                    <Container disableGutters maxWidth={false} sx={{ border: "1px solid", borderRadius: 2, padding: 2, marginBottom: 2 }}>
                        <Typography>{entry.date} <WorkIcon></WorkIcon> {entry.employerName} </Typography>
                        <Typography>{entry.description}</Typography>
                        <Typography>diagnose by {entry.specialist}</Typography>
                        <DiagnosisInfo codes={entry.diagnosisCodes} diagnoses={diagnoses} />
                    </Container>
                </div>
            );
        case "Hospital":
            return (
                <div>
                    <Container disableGutters maxWidth={false} sx={{ border: "1px solid", borderRadius: 2, padding: 2, marginBottom: 2 }}>
                        <Typography>{entry.date} <MedicalServicesIcon></MedicalServicesIcon> </Typography>
                        <Typography>{entry.description}</Typography>
                        <Typography>diagnose by {entry.specialist}</Typography>
                        <DiagnosisInfo codes={entry.diagnosisCodes} diagnoses={diagnoses} />
                    </Container>
                </div>
            );
        default: {
            const exhaustiveCheck: never = entry;
            return exhaustiveCheck;
        }
    }
}

const PatientEntries = ({ patient } : Props ) => {
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();

    useEffect(() => {
        const fetchDiagnoses = async () => {
            const diagnoses = await diagnoseService.getAll();
            setDiagnoses(diagnoses);
        };
        void fetchDiagnoses();
    }, [])

    return (
        <div>
            <Container disableGutters maxWidth={false}>
                <Typography variant="h5" sx={{ marginTop: "0.5em", marginBottom: "0.5em" }}>Entries</Typography>
                    {patient.entries.map(entry =>
                        <EntryDetails 
                            key={entry.id}
                            entry={entry}
                            diagnoses={diagnoses}
                        />
                    )}
            </Container>
        </div>
    )
}

export default PatientEntries;

