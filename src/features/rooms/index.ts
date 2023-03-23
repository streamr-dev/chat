import { createAction } from '@reduxjs/toolkit'
import { Address } from '$/types'

export const RoomsAction = {
    fetch: createAction<{ requester: Address }>('rooms: fetch'),
}
