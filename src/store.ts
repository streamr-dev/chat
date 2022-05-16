import { configureStore } from '@reduxjs/toolkit'
import session from './features/session'

const store = configureStore({
    reducer: {
        session,
    },
})

export default store
