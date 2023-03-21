import { createAction } from '@reduxjs/toolkit'
import { IDraft } from './types'

export const DraftAction = {
    store: createAction<IDraft>('drafts: store'),
}
