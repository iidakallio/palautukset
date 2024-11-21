
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

  const All = (props) => {
    return (
      <div>all {props.good + props.neutral + props.bad}</div>
    )
  }

  const Average = (props) => {
    return (
      <div>average {(props.good * 1 + props.neutral * 0 + props.bad * (-1))/(props.good + props.neutral + props.bad)}</div>
    )
  }

  const Positive = (props) => {
    return (
      <div>positive {props.good/(props.good + props.neutral + props.bad)} %</div>
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
      <All good={good} neutral={neutral} bad={bad}/>
      <Average good={good} neutral={neutral} bad={bad}/>
      <Positive good={good} neutral={neutral} bad={bad}/>
      
      
    </div>
  )
}

export default App