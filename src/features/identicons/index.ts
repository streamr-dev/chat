import { createReducer } from '@reduxjs/toolkit'
import { retrieveIdenticon, setIdenticon, setRetrieving } from './actions'
import { IdenticonsState } from './types'

const initialState: IdenticonsState = {
    items: {},
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(retrieveIdenticon, () => {
        // See `retrieveIdenticonSaga`.
    })

    builder.addCase(setIdenticon, (state, { payload: { seed, content } }) => {
        if (!state.items[seed]) {
            state.items[seed] = {
                content,
                retrieving: false,
            }
            return
        }

        state.items[seed].content = content
    })

    builder.addCase(setRetrieving, (state, { payload: { seed, value: retrieving } }) => {
        if (!state.items[seed]) {
            state.items[seed] = {
                content: undefined,
                retrieving,
            }
            return
        }

        state.items[seed].retrieving = retrieving
    })
})

export default reducer
