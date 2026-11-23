import { useEffect, useState } from "react";
import type { Diary } from "./types";
import diaryService from "./diaryService";
import axios from "axios";

interface ValidationError {
  error: {
    message: string;
    path: string[];
  }[];
}

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const visibilityOptions = ["great", "good", "ok", "poor"];
  const weatherOptions = ["sunny", "rainy", "cloudy", "stormy", "windy"];
  const [error, setError] = useState("");
  const [newDiary, setNewDiary] = useState({
    date: "",
    visibility: "",
    weather: "",
    comment: ""
  });

  useEffect(() => {
    diaryService.getAll().then(initialDiaries => {
      setDiaries(initialDiaries);
    });
  }, []);

  const createDiary = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    try {
      const returnedDiary = await diaryService.create(newDiary);
      
      setDiaries(diaries.concat(returnedDiary));

      setNewDiary({
        date: "",
        visibility: "",
        weather: "",
        comment: ""
      });
      
      setError("");
    } catch (error: unknown) {
      if (axios.isAxiosError<ValidationError>(error)) {
        const validationErrors = error.response?.data.error;

        if (validationErrors) {
          setError("Error: " + validationErrors.map(err => err.message).join(", "));
        } else {
          setError("Error: " + error.message);
        }
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <div>

      <div>
        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}
      </div>

      <div>
        <form onSubmit={createDiary}>
          <h1>Add new entry</h1>
          <div>
            Date
            <input type="date" 
              value={newDiary.date}
              onChange={(e) => setNewDiary({
                ...newDiary,
                date: e.target.value
              })}
            />
          </div>

          <div>
            Visibility
            {visibilityOptions.map(option => (
              <label key={option}>
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={newDiary.visibility === option}
                  onChange={e => setNewDiary({
                    ...newDiary,
                    visibility: e.target.value
                  })}
                />
                {option}
              </label>
            ))}
          </div>

          <div>
            Weather
            {weatherOptions.map(option => (
              <label key={option}>
                <input
                  type="radio"
                  name="weather"
                  value={option}
                  checked={newDiary.weather === option}
                  onChange={e => setNewDiary({
                    ...newDiary,
                    weather: e.target.value
                  })}
                />
                {option}
              </label>
            ))}
          </div>

          <div>
            Comment
            <input type="text" 
              value={newDiary.comment}
              onChange={(e) => setNewDiary({
                ...newDiary,
                comment: e.target.value
              })}
            />
          </div>

          <div>
            <button type="submit">Add</button>
          </div>

        </form>
      </div>

      <div>
        {diaries.map(diary => (
          <div key={diary.id} >
            <h3>Date: {diary.date}</h3>
            <p>Visibility: {diary.visibility}</p>
            <p>Weather: {diary.weather}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
