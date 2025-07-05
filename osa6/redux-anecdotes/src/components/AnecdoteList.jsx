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
    
    const vote = (id) => {
        console.log('vote', id)
        const votedAnecdote = anecdotes.find(a => a.id === id)
        dispatch(voteAnecdote(id))
        dispatch(setNotification(`you voted '${votedAnecdote.content}'`))
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
                  <button onClick={() => vote(anecdote.id)}>vote</button>
                </div>
              </div>
            )}
        </div>
        
    )
}

export default AnecdoteList