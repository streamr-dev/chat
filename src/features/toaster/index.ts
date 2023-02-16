import { ToastType } from '$/components/Toast'
import { ToasterCallback } from '$/components/Toster'
import { ToastParams } from '$/features/toaster/helpers/toast'
import { createAction, createReducer } from '@reduxjs/toolkit'
import React, { ReactNode } from 'react'

interface ToasterState {
    instance?: ToasterCallback
}

const initialState: ToasterState = {
    instance: undefined,
}

export const ToasterAction = {
    show: createAction<ToastParams>('toaster: show'),

    set: createAction<{ instance: ToasterCallback | undefined }>('toaster: set'),
}

const reducer = createReducer(initialState, (b) => {
    b.addCase(ToasterAction.set, (state, { payload: { instance } }) => {
        state.instance = instance
    })
})

export default reducer
