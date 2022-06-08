export type IdenticonSeed = string

export interface IIdenticon {
    seed: IdenticonSeed
    content: string
}

export interface IdenticonsState {
    items: {
        [index: IdenticonSeed]: {
            content: undefined | IIdenticon['content']
            retrieving: boolean
        }
    }
}
