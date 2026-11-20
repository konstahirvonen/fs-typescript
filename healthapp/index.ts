import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
    res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (
        !req.query.height || 
        !req.query.weight ||
        !Number.isFinite(height) ||
        !Number.isFinite(weight) ||
        height <= 0 ||
        weight <= 0 ||
        typeof req.query.height !== "string" ||
        typeof req.query.weight !== "string"
    ) {
        return res.status(400).json({
            error: "malformatted parameters"
        });
    }

    const bmi = calculateBmi(height, weight);

    return res.json({
        weight,
        height,
        bmi: bmi + " range"
    });
});

app.post("/exercises", (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment 
    const { target, daily_exercises } = req.body;

    if (target === undefined || daily_exercises === undefined) {
        return res.status(400).send({ error: "parameters missing" });
    }

    if (
        typeof target !== "number" ||
        !Number.isFinite(target) ||
        !Array.isArray(daily_exercises) ||
        daily_exercises.length === 0 ||
        !daily_exercises.every((value: unknown) => typeof value === "number" && Number.isFinite(value))
    ) {
        return res.status(400).send({ error: "malformatted parameters" });
    }

   
    const result = calculateExercises(Number(target), daily_exercises.map(Number));
    return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});