import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        const filter = state.filter
        const anecdotes = state.anecdotes
    
        const filtered = filter === 'ALL'
          ? anecdotes
          : anecdotes.filter(anecdote =>
              anecdote.content.toLowerCase().includes(filter.toLowerCase())
            )
    
        return filtered
      })
    const dispatch = useDispatch()
    
    const vote = (anecdote) => {
        console.log('vote', anecdote)
        const votedAnecdote = anecdotes.find(a => a.id === anecdote.id)
        dispatch(voteAnecdote(anecdote))
        dispatch(setNotification(`you voted '${votedAnecdote.content}'`, 5))
    }

    return (
        <div>
            {[...anecdotes]
            .sort((a, b) => b.votes - a.votes)
            .map(anecdote =>
              <div key={anecdote.id}>
                <div>
                  {anecdote.content}
                </div>
                <div>
                  has {anecdote.votes}
                  <button onClick={() => vote(anecdote)}>vote</button>
                </div>
              </div>
            )}
        </div>
        
    )
}

export default AnecdoteList