import getChains from './getChains'

type Chains = {
    [networkId: string]: string[]
}

type Cache = {
    [infuraId: string]: Chains
}

const cache: Cache = {}

export default function getChainUrls(infuraId = '') {
    if (cache[infuraId]) {
        return cache[infuraId]
    }

    const result: Chains = {}

    Object.entries(getChains(infuraId)).forEach(([id, { urls }]) => {
        result[id] = urls
    })

    cache[infuraId] = result

    return result
}
