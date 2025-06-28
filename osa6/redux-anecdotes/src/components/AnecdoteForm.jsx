import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'


const NewAnecdote = () => {
    const dispatch = useDispatch()

    const addNew = (event) => {
        event.preventDefault()
        console.log('add new')
        const content = event.target.newvalue.value
        event.target.newvalue.value = ''
        dispatch(addAnecdote(content))
    }

    return (
        <form onSubmit={addNew}>
        <input name="newvalue"/>
        <button type="submit">create</button>
      </form>
    )
}

export default NewAnecdote
    
