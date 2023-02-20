export type IdenticonSeed = string

export interface IIdenticon {
    seed: IdenticonSeed
    content: string
}

export type IdenticonsState = Partial<Record<IdenticonSeed, IIdenticon['content']>>
