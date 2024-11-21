
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

  const goodClick = () => setGood(good + 1)
  const neutralClick = () => setNeutral(neutral + 1)
  const badClick = () => setBad(bad + 1)


  return (
    <div>
      <h1>give feedback</h1>

      <button onClick={goodClick}>
        good
      </button>

      <button onClick={neutralClick}>
        neutral
      </button>

      <button onClick={badClick}>
        bad
      </button>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
      
      
      
    </div>
  )
}

export default App