import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call, put } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Address } from '$/types'
import { EnsAction } from '$/features/ens'
import { Flag } from '$/features/flag/types'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import MemberExistsError from '$/errors/MemberExistsError'
import getStream from '$/utils/getStream'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import trunc from '$/utils/trunc'
import { PermissionsAction } from '$/features/permissions'

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

export default function addMember({
    roomId,
    member,
    provider,
    requester,
    streamrClient,
}: ReturnType<typeof PermissionsAction.addMember>['payload']) {
    return call(function* () {
        let toastId

        try {
            toastId = toast.loading(
                <>
                    Adding <strong>{trunc(member)}</strong>…
                </>,
                {
                    position: 'bottom-left',
                    autoClose: false,
                    type: 'info',
                    closeOnClick: false,
                    hideProgressBar: true,
                }
            )

            const user: null | string = yield resolveName(member)

            if (!user) {
                throw new Error('Address could not be resolved')
            }

            const stream: null | Stream = yield getStream(streamrClient, roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const [currentPermissions]: UserPermissions = yield getUserPermissions(user, stream)

            if (currentPermissions.length) {
                throw new MemberExistsError(member)
            }

            yield setMultiplePermissions(
                roomId,
                [
                    {
                        user,
                        permissions: [StreamPermission.GRANT, StreamPermission.SUBSCRIBE],
                    },
                ],
                {
                    provider,
                    requester,
                    streamrClient,
                }
            )

            success(
                <>
                    <strong>{trunc(member)}</strong> has been added
                </>
            )

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
            if (e instanceof MemberExistsError) {
                error(
                    <>
                        <strong>{trunc(e.member)}</strong> is already a member
                    </>
                )

                return
            }

            handleError(e)

            error(
                <>
                    Failed to add <strong>{trunc(member)}</strong>
                </>
            )
        } finally {
            if (toastId) {
                toast.dismiss(toastId)
            }
        }
    })
}
