interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

interface HeaderProps {
  courseName: string;
}

interface ContentProps {
  courseParts: CoursePart[];
}

const Header = (props: HeaderProps) => {
  return <h1>{props.courseName}</h1>
}

const Part = ({ courseParts }: ContentProps) => {
  return (
    <>
      {courseParts.map(part => {
        switch (part.kind) {
          case "basic":
            return (
              <div key={part.name}>
                <p><strong>{part.name} {part.exerciseCount}</strong></p>
                <p>{part.description}</p>
              </div>
            );
          case "group":
            return (
              <div key={part.name}>
                <p><strong>{part.name} {part.exerciseCount}</strong></p>
                <p>project exercises {part.groupProjectCount}</p>
              </div>
            );
          case "background":
            return (
              <div key={part.name}>
                <p><strong>{part.name} {part.exerciseCount}</strong></p>
                <p>{part.description}</p>
                <p>submit to: {part.backgroundMaterial}</p>
              </div>
            );
          case "special":
            return (
              <div key={part.name}>
                <p><strong>{part.name} {part.exerciseCount}</strong></p>
                <p>{part.description}</p>
                <p>required skills: {part.requirements.join(", ")}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  )
}

const Content = (props: ContentProps) => {
  return (
    <div>
      <Part courseParts={props.courseParts} />
    </div>
  )
}

const Total = (props: ContentProps) => {
  
  const totalExercises = props.courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return <p>Number of exercises {totalExercises}</p>
}

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts}/>
    </div>
  );
};

export default App;