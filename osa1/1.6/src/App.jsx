
import { useState } from 'react'

const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad;
  const average = (props.good - props.bad) / total;
  const positive = (props.good / total) * 100;

  if (total === 0) {
    return <div>No feedback given</div>;
  }

  return (
    <div>
      <div>good {props.good}</div>
      <div>neutral {props.neutral}</div>
      <div>bad {props.bad}</div>
      <div>all {total}</div>
      <div>average {average}</div>
      <div>positive {positive} %</div>
    </div>
  );
};

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
      <Statistics good={good} neutral={neutral} bad={bad} />
      
      
      
    </div>
  )
}

export default App