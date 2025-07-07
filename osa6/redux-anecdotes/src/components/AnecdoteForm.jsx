import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'


const NewAnecdote = () => {
    const dispatch = useDispatch()

    const addNew = async(event) => {
        event.preventDefault()
        console.log('add new')
        const content = event.target.newvalue.value
        event.target.newvalue.value = ''
        const NewAnecdote = await anecdoteService.createNew(content)
        dispatch(addAnecdote(NewAnecdote))
        dispatch(setNotification(`you added '${content}'`))

    }

    return (
        <div><h2>create new</h2>
        <form onSubmit={addNew}>
        <input name="newvalue"/>
        <button type="submit">create</button>
      </form></div>
        
    )
}

export default NewAnecdote
    
