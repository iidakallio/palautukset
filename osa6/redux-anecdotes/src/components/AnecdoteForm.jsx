import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'


const NewAnecdote = () => {
    const dispatch = useDispatch()

    const addNew = (event) => {
        event.preventDefault()
        console.log('add new')
        const content = event.target.newvalue.value
        event.target.newvalue.value = ''
        dispatch(addAnecdote(content))
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
    
