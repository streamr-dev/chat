import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { STREAMR_STORAGE_NODE_GERMANY } from 'streamr-client'
import tw from 'twin.macro'
import { RoomAction } from '$/features/room'
import {
    useGettingStorageNodes,
    useSelectedRoomId,
    useStorageNodeState,
    useStorageNodeToggling,
} from '$/features/room/hooks'
import useSelectedRoom from '$/hooks/useSelectedRoom'
import Form from '../Form'
import Hint from '../Hint'
import Label from '../Label'
import Submit from '../Submit'
import Text from '../Text'
import Toggle from '../Toggle'
import Modal, { Props as ModalProps } from './Modal'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import { Flag } from '$/features/flag/types'
import { useGetERC20Metadata } from '$/features/tokenGatedRooms/hooks'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import TextField from '$/components/TextField'

export default function RoomPropertiesModal({
    title = 'Room properties',
    subtitle = 'Unnamed room',
    onAbort,
    ...props
}: ModalProps) {
    const selectedRoomId = useSelectedRoomId()

    const { name: roomName = '', tokenAddress, minTokenAmount, tokenType } = useSelectedRoom() || {}

    const isStorageEnabled = useStorageNodeState(selectedRoomId, STREAMR_STORAGE_NODE_GERMANY)

    const isGettingStorageNodes = useGettingStorageNodes(selectedRoomId)

    const isTogglingStorageNode = useStorageNodeToggling(
        selectedRoomId,
        STREAMR_STORAGE_NODE_GERMANY
    )

    const isStorageBusy = isTogglingStorageNode || isGettingStorageNodes

    const dispatch = useDispatch()

    const streamrClient = useWalletClient()

    const provider = useWalletProvider()

    const requester = useWalletAccount()

    function onStorageToggleClick() {
        if (!selectedRoomId || isStorageBusy || !provider || !requester || !streamrClient) {
            return
        }

        dispatch(
            RoomAction.toggleStorageNode({
                roomId: selectedRoomId,
                address: STREAMR_STORAGE_NODE_GERMANY,
                state: !isStorageEnabled,
                provider,
                requester,
                streamrClient,
                fingerprint: Flag.isTogglingStorageNode(
                    selectedRoomId,
                    STREAMR_STORAGE_NODE_GERMANY
                ),
            })
        )
    }

    useEffect(() => {
        if (!open || !selectedRoomId || !streamrClient) {
            return
        }

        dispatch(
            RoomAction.getStorageNodes({
                roomId: selectedRoomId,
                streamrClient,
                fingerprint: Flag.isGettingStorageNodes(selectedRoomId),
            })
        )
    }, [open, selectedRoomId])

    useEffect(() => {
        if (!tokenAddress || !tokenType || !provider) {
            return
        }

        dispatch(
            TokenGatedRoomAction.getTokenMetadata({
                tokenAddress,
                tokenType,
                provider,
            })
        )
    }, [tokenAddress, tokenType, provider])

    const tokenMetadata = useGetERC20Metadata()

    return (
        <Modal {...props} onAbort={onAbort} title={title} subtitle={roomName || subtitle}>
            {tokenMetadata && minTokenAmount ? (
                <>
                    <Label>
                        <b>Token Name:</b>
                        {tokenMetadata.name}
                    </Label>
                    <Label>
                        <b>Symbol:</b>
                        {tokenMetadata.symbol}
                    </Label>
                    <Label>
                        <b>Decimals:</b>
                        {tokenMetadata.decimals.toString()}
                    </Label>
                    <Label>
                        <b>Address:</b>
                        {tokenAddress}
                    </Label>
                    <Label>
                        <b>Minimum Required Balance:</b>
                        {minTokenAmount / 10 ** Number(tokenMetadata.decimals)}
                    </Label>
                </>
            ) : null}
            <Form onSubmit={() => void onAbort?.()}>
                {!!selectedRoomId && (
                    <>
                        <Label>Room id</Label>
                        <TextField defaultValue={selectedRoomId} readOnly />
                    </>
                )}
                <>
                    <Label>Message storage</Label>
                    <div css={tw`flex`}>
                        <div css={tw`grow`}>
                            <Hint css={tw`pr-16`}>
                                <Text>
                                    When message storage is disabled, participants will only see
                                    messages sent while they are online.
                                </Text>
                            </Hint>
                        </div>
                        <div css={tw`mt-2`}>
                            <Toggle
                                value={isStorageBusy ? undefined : isStorageEnabled}
                                onClick={onStorageToggleClick}
                                busy={isStorageBusy}
                            />
                        </div>
                    </div>
                </>
                <>
                    <Submit label="Close" />
                </>
            </Form>
        </Modal>
    )
}

RoomPropertiesModal.displayName = 'RoomPropertiesModal'
