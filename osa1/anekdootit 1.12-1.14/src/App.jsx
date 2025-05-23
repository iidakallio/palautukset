
import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return <button onClick={handleClick}>{text}</button>;
};

const generateRandomAnecdote = (anecdotes, setSelected) => {
    
  const randomNumber = Math.floor(Math.random() * anecdotes.length);
  console.log(anecdotes.length, randomNumber)
  setSelected(randomNumber);

};

const voteAnecdote = (points, selected, setPoints) => {
  const newPoints = [...points];
  newPoints[selected] += 1;
  setPoints(newPoints);
};

const MostVotes = ({points, anecdotes}) => {
  var maxindex = points.indexOf(Math.max(...points));
  console.log(maxindex);
  return (
    <div>
      {anecdotes[maxindex]} <br />
      has {points[maxindex]} votes
    </div>
  );
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));
      
    
  

  return (
    <div>
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}<br />
        has {points[selected]} votes<br />
        <Button handleClick={() =>voteAnecdote(points, selected, setPoints)} text="vote"/>
        <Button handleClick={() =>generateRandomAnecdote(anecdotes, setSelected)} text="next anecdote" />
        <h1>Anecdote with most votes</h1>
        <MostVotes points={points} anecdotes={anecdotes}/>

    </div>
  )
}

export default App