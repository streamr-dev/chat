import { createAction } from '@reduxjs/toolkit'
import { IDraft } from './types'

export enum DraftAction {
    StoreDraft = 'store a draft',
}

export const storeDraft = createAction<IDraft>(DraftAction.StoreDraft)
