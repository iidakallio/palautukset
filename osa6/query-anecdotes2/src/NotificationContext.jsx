import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return action.payload 
        case 'CLEAR':
            return ''
        default: 
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ( props ) => {
    const [notification, dispatch] = useReducer(notificationReducer, '')

    return (
        <NotificationContext.Provider value={[notification, dispatch]}>
            {props.children}</NotificationContext.Provider>
    )
}

export const useNotification = () => useContext(NotificationContext)