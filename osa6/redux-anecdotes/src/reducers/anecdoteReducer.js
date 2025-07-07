import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice( {
  name: 'anecdote',
  initialState: [],
  reducers: {
    voteAnecdote(state, action){
      console.log('action', action)
      const id = action.payload
       const anecdoteToChange = state.find(n => n.id === id)
       const changedAnecdote = {
         ...anecdoteToChange,
         votes: anecdoteToChange.votes + 1
       }
      
       return state.map(anecdote =>
         anecdote.id !== id ? anecdote : changedAnecdote 
       )
    },
    addAnecdote(state, action){
      console.log('action', action)
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, addAnecdote, appendAnecdote, setAnecdotes} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    console.log('initializing anecdotes...')
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export default anecdoteSlice.reducer