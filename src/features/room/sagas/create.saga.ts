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
import { TokenTypes } from '$/features/tokenGatedRooms/types'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { MiscAction } from '$/features/misc'
import { RoomMetadata } from '$/utils/getRoomMetadata'
import toast, { Controller } from '$/features/toaster/helpers/toast'
import { ToastType } from '$/components/Toast'

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
        tc = yield toast({
            title: `Creating "${params.name}"…`,
            type: ToastType.Processing,
        })

        dismissToast = true

        yield preflight({
            provider,
            requester,
        })

        // `payload.id` is a partial room id. The real room id gets constructed by the
        // client from the given value and the account address that creates the stream.

        const { id, name: description, ...metadata }: Omit<IRoom, 'owner'> = params

        // validate the metadata for tokenGated rooms
        if (privacy === PrivacySetting.TokenGated) {
            if (!metadata.tokenAddress) {
                throw new Error('Token address is required for tokenGated rooms')
            }

            if (!metadata.tokenType) {
                throw new Error('TokenType is required for tokenGated rooms')
            }

            if (
                !metadata.tokenId &&
                (metadata.tokenType.standard === TokenTypes.ERC721.standard ||
                    metadata.tokenType.standard === TokenTypes.ERC1155.standard)
            ) {
                throw new Error('Token id is required for NFT tokenGated rooms')
            }

            if (
                (!metadata.minTokenAmount || metadata.minTokenAmount <= 0) &&
                (metadata.tokenType.standard === TokenTypes.ERC20.standard ||
                    metadata.tokenType.standard === TokenTypes.ERC1155.standard)
            ) {
                throw new Error('Min token amount is required for tokenGated rooms')
            }
        }

        const stream: Stream = yield streamrClient.createStream({
            id,
            description,
            extensions: {
                'thechat.eth': metadata,
            },
        } as Partial<StreamMetadata> & { id: string } & Record<'extensions', Record<'thechat.eth', RoomMetadata>>)

        if (
            privacy === PrivacySetting.TokenGated &&
            metadata.tokenType!.standard === TokenTypes.ERC20.standard &&
            metadata.tokenAddress &&
            metadata.minTokenAmount
        ) {
            yield put(
                TokenGatedRoomAction.registerERC20Policy({
                    owner,
                    tokenAddress: metadata.tokenAddress,
                    roomId: stream.id,
                    minTokenAmount: metadata.minTokenAmount,
                    provider,
                    streamrClient,
                })
            )
        }

        if (privacy === PrivacySetting.Public) {
            try {
                yield stream.grantPermissions({
                    public: true,
                    permissions: [StreamPermission.SUBSCRIBE],
                })

                // We don't bother the user with an extra "we made your room public"
                // toast. That'd be too much.
            } catch (e) {
                dismissToast = false

                tc?.update({
                    title: `Failed to make "${params.name}" public`,
                    type: ToastType.Error,
                })
            }
        }

        yield db.rooms.add({
            ...params,
            id: stream.id,
            owner: owner.toLowerCase(),
        })

        dismissToast = false

        tc?.update({
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

        tc?.update({
            title: `Failed to create "${params.name}". Reason:\n${e.message}`,
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
