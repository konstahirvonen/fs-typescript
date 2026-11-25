import express from 'express';
import cors from 'cors';
import diagnoseRouter from "./routes/diagnoses.ts";
import patientRouter from "./routes/patients.ts";
import { NewEntry } from './utils.ts';
import patientService from './services/patientService.ts';
import { z } from "zod";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.post("/api/patients/:id/entries", (req, res) => {
  try {
    const newEntry = NewEntry(req.body);
    const addedEntry = patientService.addEntry(req.params.id, newEntry);

    res.status(201).json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Patient not found") {
      res.status(404).send({ error: "Patient not found" });
      return;
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: error.issues.map(i => ({
          field: i.path.join("."),
          message: i.message
        }))
      });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/api/diagnoses", diagnoseRouter);
app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});