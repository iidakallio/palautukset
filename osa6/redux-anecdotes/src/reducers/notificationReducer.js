import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: 'initial notification',
    reducers: {
        notificationChange(state, action) {
            return action.payload
        }
    }
})

export const {notificationChange} = notificationSlice.actions
export default notificationSlice.reducer