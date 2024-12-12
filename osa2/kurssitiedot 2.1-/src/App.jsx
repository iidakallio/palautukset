const Course = ({course}) => {
  const result = course.parts.map(part => part.id)
  console.log(result)
  return (
    
    <div>
    <h1>{course.name}</h1>
    
      {course.parts.map(part => 
        <p key={part.id}>
        {part.name} {part.exercises}
        </p>
      )}
   
    </div>
   
  )
    
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App;
// const Header = (props) => {
  
//   return (
//     <div>
//       <h1>{props.course}</h1>
//     </div>
//   )
// }

// const Part = (props) => {
//   console.log(props)
//   return (
//     <div>
//       <p>{props.part} {props.exercises}</p>
//     </div>
//   )
// }

// const Content = ({ parts }) => {
//   console.log(parts)
//   return (
//     <div>
      
//       <Part part={parts[0].name} exercises={parts[0].exercises}/>
//       <Part part={parts[1].name} exercises={parts[1].exercises}/>
//       <Part part={parts[2].name} exercises={parts[2].exercises}/>
       
//     </div>
//   )
// }

// const Total = ({parts}) => {
//   return (
//     <div>
//       <p>Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>
//     </div>
//   )
// }

// const App = () => {
//   const course = {
//     name: 'Half Stack application development',
//     parts: [
//       {
//         name: 'Fundamentals of React',
//         exercises: 10
//       },
//       {
//         name: 'Using props to pass data',
//         exercises: 7
//       },
//       {
//         name: 'State of a component',
//         exercises: 14
//       }
//     ]
//   }

//   return (
//     <div>
//       <Header course={course.name} />
//       <Content parts={course.parts} />
//       <Total parts={course.parts} />
//     </div>
//   )
// }

// export default App

