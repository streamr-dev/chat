import { configureStore } from '@reduxjs/toolkit'
import wallet from './features/wallet'

const store = configureStore({
    reducer: {
        wallet,
    },
})

export default store
