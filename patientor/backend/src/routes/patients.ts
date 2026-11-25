import express, { type Request, type Response, type NextFunction } from "express";
import patientService from "../services/patientService.ts";
import { NewPatientSchema, type NewPatientEntry, type PatientEntry, type NonSensitivePatientEntry, type Patient } from "../types.ts";
import { z } from "zod";

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientEntry[]>) => {
  const data = patientService.getNonsentiveEntries();
  res.send(data);
});

router.get("/:id", (req, res: Response<Patient | undefined>) => {
  const data = patientService.getNonsensitivePatient(req.params.id);
  if (data) {
    res.send(data);
  } else {
    res.sendStatus(404);
  }
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<PatientEntry>) => {
  const addedEntry = patientService.addPatient(req.body);
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;