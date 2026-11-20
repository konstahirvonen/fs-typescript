interface Exercises {
    target: number,
    daily: number[]
}

interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

const parseArguments = (args: string[]): Exercises => {
    if (args.length < 4) throw new Error("Not enough arguments");

    const daily = args.slice(3).map(Number);
    

    if (!isNaN(Number(args[2])) && daily.every(hours => !isNaN(hours))) {
        return {
            target: Number(args[2]),
            daily: args.slice(3).map(Number)
        };
    } else {
        throw new Error("Provided values were not numbers!");
    }
};


export const calculateExercises = (target: number, daily: number[]): Result => {
    const periodLength = daily.length;
    const trainingDays = daily.filter(hours => hours > 0).length;
    const sum = daily.reduce((sum, hours) => sum + hours, 0);
    const average = sum / daily.length;

    let success = false;
    if (average >= target) {
        success = true;
    };

    let rating = 1;
    let ratingDescription = "bad";

    if (average >= target) {
        rating = 3;
        ratingDescription = "good";
    } else if (average > 1 && average < 2) {
        rating = 2;
        ratingDescription = "not too bad but could be better";
    }
 
    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

if (process.argv[1] === import.meta.filename) {
    try {
        const { target, daily } = parseArguments(process.argv);
        console.log(calculateExercises(target, daily));
    } catch (error: unknown) {
        let errorMessage = "Something bad happened";
        if (error instanceof Error) {
            errorMessage += "Error: " + error.message;
        }
        console.log(errorMessage);
    }
}

export {};