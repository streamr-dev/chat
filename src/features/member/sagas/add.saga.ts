import { MemberAction } from '$/features/member'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call, put } from 'redux-saga/effects'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import { StreamPermission } from 'streamr-client'
import { toast } from 'react-toastify'
import takeEveryUnique from '$/utils/takeEveryUnique'
import axios from 'axios'
import { Address } from '$/types'
import { EnsAction } from '$/features/ens'
import { Flag } from '$/features/flag/types'

function isENS(user: any): boolean {
    return typeof user === 'string' && /\.eth$/.test(user)
}

async function resolveName(user: Address): Promise<null | string> {
    if (!isENS(user)) {
        return user
    }

    const query = `
        query {
            domains(where: { name_in: ${JSON.stringify([user]).toLowerCase()} }) {
                name
                resolvedAddress {
                    id
                }
            }
        }
    `

    try {
        const {
            data: {
                data: {
                    domains: [
                        {
                            resolvedAddress: { id },
                        },
                    ],
                },
            },
        } = await axios.post('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
            query,
        })

        return id
    } catch (e) {
        // Ignore.
    }

    return null
}

function* onAddAction({
    payload: { roomId, member, provider, requester, streamrClient },
}: ReturnType<typeof MemberAction.add>) {
    let toastId

    try {
        toastId = toast.loading(`Adding "${member}"…`, {
            position: 'bottom-left',
            autoClose: false,
            type: 'info',
            closeOnClick: false,
            hideProgressBar: true,
        })

        const user: null | string = yield resolveName(member)

        if (!user) {
            throw new Error('Address could not be resolved')
        }

        yield call(
            setMultiplePermissions,
            roomId,
            [
                {
                    user,
                    permissions: [StreamPermission.GRANT],
                },
            ],
            {
                provider,
                requester,
                streamrClient,
            }
        )

        success(`"${member}" has gotten added.`)

        if (isENS(member)) {
            yield put(
                EnsAction.store({
                    record: {
                        address: user,
                        content: member,
                    },
                    fingerprint: Flag.isENSNameBeingStored(member),
                })
            )
        }
    } catch (e) {
        handleError(e)

        error(`Failed to add "${member}".`)
    } finally {
        if (toastId) {
            toast.dismiss(toastId)
        }
    }
}

export default function* add() {
    yield takeEveryUnique(MemberAction.add, onAddAction)
}
