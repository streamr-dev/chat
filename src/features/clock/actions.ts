import { createAction } from '@reduxjs/toolkit'
import { ClockAction } from './types'

export const tick = createAction<number>(ClockAction.Tick)
