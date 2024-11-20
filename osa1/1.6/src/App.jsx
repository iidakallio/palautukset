
import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodclick = () => setGood(good + 1)
  const neutralclick = () => setNeutral(neutral + 1)
  const badclick = () => setBad(bad + 1)


  const DisplayGood = (props) => {
    return (
      <div>good {props.good}</div>
    )
  }
  const DisplayNeutral = (props) => {
    return (
      <div>good {props.neutral}</div>
    )
  }
  const DisplayBad = (props) => {
    return (
      <div>good {props.bad}</div>
    )
  }

  return (
    <div>
      <h1>give feedback</h1>

      <button onClick={goodclick}>
        good
      </button>

      <button onClick={neutralclick}>
        neutral
      </button>

      <button onClick={badclick}>
        bad
      </button>
      <h1>statistics</h1>
      <DisplayGood good={good}/>
      <DisplayNeutral neutral={neutral}/>
      <DisplayBad bad={bad}/>
      
      
    </div>
  )
}

export default App
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

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
