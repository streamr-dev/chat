import { IENSName } from '$/features/ens/types'
import { Address, IFingerprinted } from '$/types'
import { createAction } from '@reduxjs/toolkit'

export const EnsAction = {
    fetchNames: createAction<Address[]>('ens: fetch names'),

    store: createAction<IFingerprinted & { record: IENSName }>('ens: store'),
}
