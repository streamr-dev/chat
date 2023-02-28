import db from '$/utils/db'
import { put, takeEvery } from 'redux-saga/effects'
import {
    Stream,
    StreamMetadata,
    StreamPermission,
    STREAMR_STORAGE_NODE_GERMANY,
} from 'streamr-client'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { PrivacySetting } from '$/types'
import { IRoom } from '../types'
import { RoomAction } from '..'
import { Flag } from '$/features/flag/types'
import { TokenStandard, TokenTypes } from '$/features/tokenGatedRooms/types'
import { MiscAction } from '$/features/misc'
import { RoomMetadata } from '$/utils/getRoomMetadata'
import { BigNumber } from 'ethers'
import toast, { Controller } from '$/features/toaster/helpers/toast'
import { ToastType } from '$/components/Toast'
import retoast from '$/features/toaster/helpers/retoast'
import createTokenGatePolicy from '$/features/tokenGatedRooms/helpers/createTokenGatePolicy'
import recover from '$/utils/recover'

function* onCreateAction({
    payload: {
        privacy,
        storage,
        params: { owner, ...params },
        provider,
        requester,
        streamrClient,
    },
}: ReturnType<typeof RoomAction.create>) {
    let tc: Controller | undefined

    let dismissToast = false

    try {
        yield preflight({
            provider,
            requester,
        })

        // `payload.id` is a partial room id. The real room id gets constructed by the
        // client from the given value and the account address that creates the stream.

        const { id, name: description, ...metadata }: Omit<IRoom, 'owner'> = params

        const {
            tokenAddress = '',
            tokenType = TokenTypes[TokenStandard.Unknown],
            tokenIds = [],
            minRequiredBalance = '0',
            stakingEnabled = false,
        } = metadata

        if (privacy === PrivacySetting.TokenGated) {
            if (!tokenAddress) {
                throw new Error('No token address')
            }

            if (tokenType.standard === TokenStandard.Unknown) {
                throw new Error('Unknown token type')
            }

            if (tokenType.hasIds && tokenIds.length === 0) {
                throw new Error('Empty token ids')
            }

            if (tokenType.isCountable && BigNumber.from(minRequiredBalance).lte(0)) {
                throw new Error('Invalid min required balance')
            }

            if (
                tokenType.standard !== TokenStandard.ERC20 &&
                tokenType.standard !== TokenStandard.ERC721
            ) {
                yield toast({
                    title: 'Only ERC-20s & ERC-721s are supported',
                    type: ToastType.Error,
                    okLabel: 'Ok',
                })

                throw new Error('Unsupported standard')
            }
        }

        tc = yield retoast(tc, {
            title: `Creating "${params.name}"…`,
            type: ToastType.Processing,
        })

        dismissToast = true

        const stream = yield* recover(function* () {
            const s: Stream = yield streamrClient.createStream({
                id,
                description,
                extensions: {
                    'thechat.eth': metadata,
                },
            } as Partial<StreamMetadata> & { id: string } & Record<'extensions', Record<'thechat.eth', RoomMetadata>>)

            return s
        }, {})

        if (privacy === PrivacySetting.TokenGated) {
            yield createTokenGatePolicy({
                owner,
                tokenAddress,
                roomId: stream.id,
                tokenIds,
                minRequiredBalance,
                provider,
                streamrClient,
                tokenType,
                stakingEnabled,
            })
        }

        if (privacy === PrivacySetting.Public) {
            tc = yield retoast(tc, {
                title: `Making "${params.name}" public…`,
                type: ToastType.Processing,
            })

            dismissToast = true

            yield* recover(
                function* () {
                    yield stream.grantPermissions({
                        public: true,
                        permissions: [StreamPermission.SUBSCRIBE],
                    })
                },
                {
                    title: `Failed to make "${params.name}" public`,
                    desc: 'Would you like to try again? If you click "No" the room will stay private.',
                }
            )
        }

        yield db.rooms.add({
            ...params,
            id: stream.id,
            owner: owner.toLowerCase(),
        })

        dismissToast = false

        tc = yield retoast(tc, {
            title: `Room "${params.name}" created`,
            type: ToastType.Success,
        })

        yield put(MiscAction.goto(stream.id))

        if (storage) {
            yield put(
                RoomAction.toggleStorageNode({
                    roomId: stream.id,
                    address: STREAMR_STORAGE_NODE_GERMANY,
                    state: true,
                    provider,
                    requester,
                    streamrClient,
                    fingerprint: Flag.isTogglingStorageNode(
                        stream.id,
                        STREAMR_STORAGE_NODE_GERMANY
                    ),
                })
            )
        }
    } catch (e: any) {
        handleError(e)

        dismissToast = false

        tc = yield retoast(tc, {
            title: `Failed to create "${params.name}"`,
            type: ToastType.Error,
        })
    } finally {
        if (dismissToast) {
            tc?.dismiss()
        }
    }
}

export default function* create() {
    yield takeEvery(RoomAction.create, onCreateAction)
}
