import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'


const NewAnecdote = () => {
    const dispatch = useDispatch()

    const addNew = async(event) => {
        event.preventDefault()
        console.log('add new')
        const content = event.target.newvalue.value
        event.target.newvalue.value = ''
        dispatch(createAnecdote(content))
        dispatch(setNotification(`you added '${content}'`, 10))

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