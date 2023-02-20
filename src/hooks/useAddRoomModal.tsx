import AddRoomModal, { NewRoom, Pin } from '$/components/modals/AddRoomModal'
import AddTokenGatedRoomModal from '$/components/modals/AddTokenGatedRoomModal'
import { RoomAction } from '$/features/room'
import { TokenTypes } from '$/features/tokenGatedRooms/types'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import useModalDialog from '$/hooks/useModalDialog'
import { Prefix, PrivacySetting } from '$/types'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

export default function useAddRoomModal() {
    const { open: openNameModal, modal: nameModal } = useModalDialog(AddRoomModal)

    const { open: openTokenModal, modal: tokenModal } = useModalDialog(AddTokenGatedRoomModal)

    const account = useWalletAccount()

    const provider = useWalletProvider()

    const streamrClient = useWalletClient()

    const dispatch = useDispatch()

    const open = useCallback(async () => {
        if (!account || !streamrClient || !provider) {
            return
        }

        let lastParams: Pin | NewRoom = {
            name: '',
            storage: true,
            privacy: PrivacySetting.Private,
        }

        while (true) {
            try {
                const params: Pin | NewRoom = await openNameModal({
                    params: lastParams,
                })

                lastParams = params

                if ('roomId' in params) {
                    dispatch(
                        RoomAction.pin({
                            roomId: params.roomId,
                            requester: account,
                            streamrClient,
                            provider,
                        })
                    )

                    return
                }

                if (params.privacy !== PrivacySetting.TokenGated) {
                    const now = Date.now()

                    dispatch(
                        RoomAction.create({
                            params: {
                                createdAt: now,
                                createdBy: account,
                                id: `/${Prefix.Room}/${uuidv4()}`,
                                name: params.name,
                                owner: account,
                                updatedAt: now,
                            },
                            privacy: params.privacy,
                            storage: params.storage,
                            provider,
                            requester: account,
                            streamrClient,
                        })
                    )

                    return
                }

                try {
                    const tokenParams = await openTokenModal({
                        subtitle: params.name,
                    })

                    const now = Date.now()

                    const tokenType = TokenTypes[tokenParams.standard]

                    dispatch(
                        RoomAction.create({
                            params: {
                                createdAt: now,
                                createdBy: account,
                                id: `/${Prefix.Room}/${uuidv4()}`,
                                name: params.name,
                                owner: account,
                                updatedAt: now,
                                tokenAddress: tokenParams.tokenAddress,
                                minRequiredBalance: BigNumber.from(
                                    tokenParams.tokenCount || 0
                                ).toString(),
                                tokenIds: tokenParams.tokenIds.map((id) =>
                                    BigNumber.from(id).toString()
                                ),
                                tokenType,
                            },
                            privacy: params.privacy,
                            storage: params.storage,
                            provider,
                            requester: account,
                            streamrClient,
                        })
                    )

                    break
                } catch (e) {
                    console.warn('createTokenGatedRoom error', e)
                    // Do nothing. Let it loop back to the first modal.
                }
            } catch (e) {
                break
            }
        }
    }, [openNameModal, account, streamrClient, provider])

    return {
        open,
        modal: (
            <>
                {nameModal}
                {tokenModal}
            </>
        ),
    }
}
