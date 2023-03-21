import { EnsAction } from '$/features/ens'
import { Flag } from '$/features/flag/types'
import { Address } from '$/types'
import handleError from '$/utils/handleError'
import axios from 'axios'
import { call, put } from 'redux-saga/effects'

interface Domain {
    name: string
    resolvedAddress: {
        id: Address
    }
}

type Result = Record<Address, string[]>

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

export default function fetchEnsDomains(addresses: string[]) {
    return call(function* () {
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
                                address,
                            },
                            fingerprint: Flag.isENSNameBeingStored(content),
                        })
                    )
                }
            }
        } catch (e) {
            handleError(e)
        }
    })
}
