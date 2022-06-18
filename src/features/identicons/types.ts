export type IdenticonSeed = string

export interface IIdenticon {
    seed: IdenticonSeed
    content: string
}

export interface IdenticonsState {
    [index: IdenticonSeed]: undefined | IIdenticon['content']
}
