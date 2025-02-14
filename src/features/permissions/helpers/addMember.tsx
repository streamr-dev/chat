import handleError from '$/utils/handleError'
import { call, cancelled, put } from 'redux-saga/effects'
import { Stream, StreamPermission } from '@streamr/sdk'
import axios from 'axios'
import { Address } from '$/types'
import { EnsAction } from '$/features/ens'
import { Flag } from '$/features/flag/types'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import MemberExistsError from '$/errors/MemberExistsError'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'
import { ToastType } from '$/components/Toast'
import fetchStream from '$/utils/fetchStream'
import i18n from '$/utils/i18n'
import retoast from '$/features/misc/helpers/retoast'

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
    requester,
}: ReturnType<typeof PermissionsAction.addMember>['payload']) {
    return call(function* () {
        const toast = retoast()

        try {
            yield toast.pop({
                title: i18n('memberToast.addingTitle', member),
                type: ToastType.Processing,
            })

            const userId: null | string = yield resolveName(member)

            if (!userId) {
                throw new Error('Address could not be resolved')
            }

            const stream: Stream | null = yield fetchStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const [currentPermissions]: UserPermissions = yield getUserPermissions(userId, stream)

            if (currentPermissions.length) {
                throw new MemberExistsError(member)
            }

            yield setMultiplePermissions(
                roomId,
                [
                    {
                        userId,
                        permissions: [StreamPermission.GRANT, StreamPermission.SUBSCRIBE],
                    },
                ],
                {
                    requester,
                }
            )

            yield toast.pop({
                title: i18n('memberToast.successTitle', member),
                type: ToastType.Success,
            })

            if (isENS(member)) {
                yield put(
                    EnsAction.store({
                        record: {
                            address: userId,
                            content: member,
                        },
                        fingerprint: Flag.isENSNameBeingStored(member),
                    })
                )
            }
        } catch (e) {
            if (e instanceof MemberExistsError) {
                yield toast.pop({
                    title: i18n('memberToast.alreadyMemberTitle', e.member),
                    type: ToastType.Error,
                })

                return
            }

            handleError(e)

            yield toast.pop({
                title: i18n('memberToast.failureTitle', member),
                type: ToastType.Error,
            })
        } finally {
            toast.discard({ asap: yield cancelled() })
        }
    })
}
