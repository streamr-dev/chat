export type IdenticonSeed = string

export interface IIdenticon {
    seed: IdenticonSeed
    content: string
}

export enum IdenticonAction {
    Retrieve = 'retrieve identicon',
    Store = 'store identicon',
    Set = 'set identicon',
    SetRetrieving = 'set retrieving identicon',
}

export interface IdenticonsState {
    items: {
        [index: IdenticonSeed]: {
            content: undefined | IIdenticon['content']
            retrieving: boolean
        }
    }
}
