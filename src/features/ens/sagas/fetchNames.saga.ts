import { EnsAction } from '$/features/ens'
import { Address } from '$/types'
import { put, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import handleError from '$/utils/handleError'
import { Flag } from '$/features/flag/types'

interface Domain {
    name: string
    resolvedAddress: {
        id: Address
    }
}

interface Result {
    [address: Address]: string[]
}

async function fetchDomains(addresses: Address[]) {
    const query = `
        query {
            domains(where: { resolvedAddress_in: ${JSON.stringify(addresses).toLowerCase()} }) {
                name
                resolvedAddress {
                    id
                }
            }
        }
    `

    const {
        data: {
            data: { domains },
        },
    } = await axios.post('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
        query,
    })

    const result: Result = {}

    domains.forEach(({ name, resolvedAddress: { id } }: Domain) => {
        if (!result[id]) {
            result[id] = []
        }

        result[id].push(name)
    })

    return result
}

function* onFetchNamesAction({ payload: addresses }: ReturnType<typeof EnsAction.fetchNames>) {
    try {
        const entries = Object.entries((yield fetchDomains(addresses)) as Result)

        for (let i = 0; i < entries.length; i++) {
            const [address, names] = entries[i]

            for (let j = 0; j < names.length; j++) {
                const content = names[j]

                yield put(
                    EnsAction.store({
                        record: {
                            content,
                            address: address.toLowerCase(),
                        },
                        fingerprint: Flag.isENSNameBeingStored(content),
                    })
                )
            }
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* fetchNames() {
    yield takeEvery(EnsAction.fetchNames, onFetchNamesAction)
}
