import { createAction } from '@reduxjs/toolkit'

export const ClockAction = {
    Tick: createAction<number>('clock: tick'),
}
