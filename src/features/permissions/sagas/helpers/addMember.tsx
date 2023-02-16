import handleError from '$/utils/handleError'
import { call, put } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'
import axios from 'axios'
import { Address } from '$/types'
import { EnsAction } from '$/features/ens'
import { Flag } from '$/features/flag/types'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import MemberExistsError from '$/errors/MemberExistsError'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import trunc from '$/utils/trunc'
import { PermissionsAction } from '$/features/permissions'
import toast, { Controller } from '$/features/toaster/helpers/toast'
import { ToastType } from '$/components/Toast'

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
        let tc: Controller | undefined

        try {
            tc = yield toast({
                title: (
                    <>
                        Adding <strong>{trunc(member)}</strong>…
                    </>
                ),
                type: ToastType.Processing,
            })

            const user: null | string = yield resolveName(member)

            if (!user) {
                throw new Error('Address could not be resolved')
            }

            const stream: null | Stream = yield streamrClient.getStream(roomId)

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

            tc.update({
                title: (
                    <>
                        <strong>{trunc(member)}</strong> has been added
                    </>
                ),
                type: ToastType.Success,
            })

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
                tc?.update({
                    title: (
                        <>
                            <strong>{trunc(e.member)}</strong> is already a member
                        </>
                    ),
                    type: ToastType.Error,
                })

                return
            }

            handleError(e)

            tc?.update({
                title: (
                    <>
                        Failed to add <strong>{trunc(member)}</strong>
                    </>
                ),
                type: ToastType.Error,
            })
        } finally {
            tc?.dismiss()
        }
    })
}
