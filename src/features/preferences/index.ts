import { IPreference } from '$/features/preferences/types'
import { createAction } from '@reduxjs/toolkit'

export const PreferencesAction = {
    set: createAction<IPreference>('preferences: set'),
}
