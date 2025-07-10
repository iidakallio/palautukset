import { useMutation, useQueryClient} from '@tanstack/react-query'
import { createAnecdote } from '../requests'

const AnecdoteForm = () => {

  const queryClient = useQueryClient()
  
    const newAnecdoteMutation = useMutation({ 
      mutationFn: createAnecdote, 
      onSuccess: (newAnecdote) => {
        const anecdotes = queryClient.getQueryData(['anecdotes'])
        queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))}
      
      })
  

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    if (content.length < 5) {
      console.log('Too short anecdote, must have length 5 or more')
      return
    }
    newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
