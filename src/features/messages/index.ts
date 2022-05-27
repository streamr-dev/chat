import { createReducer } from '@reduxjs/toolkit'
import { MessageAction } from './actions'

const reducer = createReducer({}, (builder) => {
    builder.addCase(MessageAction.CreateMessage, () => {
        // See `createMessageSaga`.
    })
})

export default reducer
