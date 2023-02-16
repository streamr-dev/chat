import Toast from '$/components/Toast'
import { ToasterCallback } from '$/components/Toaster'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { ComponentProps } from 'react'

interface ToasterState {
    instance?: ToasterCallback
}

const initialState: ToasterState = {
    instance: undefined,
}

export const ToasterAction = {
    show: createAction<ComponentProps<typeof Toast>>('toaster: show'),

    set: createAction<{ instance: ToasterCallback | undefined }>('toaster: set'),
}

const reducer = createReducer(initialState, (b) => {
    b.addCase(ToasterAction.set, (state, { payload: { instance } }) => {
        state.instance = instance
    })
})

export default reducer
