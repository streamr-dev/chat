import { createReducer } from '@reduxjs/toolkit'
import { storeDraft } from './actions'

const reducer = createReducer({}, (builder) => {
    builder.addCase(storeDraft, () => {
        // See `storeDraftSaga`.
    })
})

export default reducer
