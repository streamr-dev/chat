import { Address } from '$/types'
import { createAction } from '@reduxjs/toolkit'

export const AliasAction = {
    set: createAction<{
        address: Address
        owner: Address
        value: string
    }>('alias: create'),
}
