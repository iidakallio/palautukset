import { createSlice } from '@reduxjs/toolkit'

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
export default anecdoteSlice.reducer