import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { STREAMR_STORAGE_NODE_GERMANY } from 'streamr-client'
import tw from 'twin.macro'
import { PrivacySetting } from '$/types'
import { RoomAction } from '$/features/room'
import {
    useChangingPrivacy,
    useGettingPrivacy,
    useGettingStorageNodes,
    usePrivacyOption,
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
import Modal, { ModalProps } from './Modal'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import { Flag } from '$/features/flag/types'
import PrivacySelectField from '$/components/PrivacySelectField'
import { useGetTokenMetadata } from '$/features/tokenGatedRooms/hooks'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { BigNumber } from 'ethers'

export default function RoomPropertiesModal({ open, setOpen, ...props }: ModalProps) {
    const selectedRoomId = useSelectedRoomId()

    const {
        name: roomName = '',
        tokenAddress,
        minRequiredBalance,
        tokenType,
        tokenId,
        stakingEnabled,
    } = useSelectedRoom() || {}

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

        dispatch(
            RoomAction.getPrivacy({
                roomId: selectedRoomId,
                streamrClient,
                fingerprint: Flag.isGettingPrivacy(selectedRoomId),
            })
        )
    }, [open, selectedRoomId])

    const privacyOption = usePrivacyOption(selectedRoomId)

    const tokenMetadata = useGetTokenMetadata()

    useEffect(() => {
        if (!tokenAddress || !tokenType || !provider) {
            return
        }

        dispatch(
            TokenGatedRoomAction.getTokenMetadata({
                tokenAddress,
                tokenType,
                provider,
                tokenId: tokenId ? tokenId.toString() : BigNumber.from(0).toString(),
            })
        )
    }, [tokenAddress, tokenType, provider, tokenId, tokenMetadata])

    const isChangingPrivacy = useChangingPrivacy(selectedRoomId)

    const isGettingPrivacy = useGettingPrivacy(selectedRoomId)

    const isPrivacyBusy = isChangingPrivacy || isGettingPrivacy

    function onSubmit() {
        if (typeof setOpen === 'function') {
            setOpen(false)
        }
    }

    return (
        <Modal
            {...props}
            open={open}
            setOpen={setOpen}
            title="Room properties"
            subtitle={roomName || 'Unnamed room'}
        >
            {tokenMetadata && (
                <>
                    {tokenType && (
                        <Label>
                            <b>Token Standard:</b>
                            {tokenType.standard}
                        </Label>
                    )}

                    {tokenAddress && (
                        <Label>
                            <b>Address:</b>
                            {tokenAddress}
                        </Label>
                    )}

                    {tokenMetadata.name && (
                        <Label>
                            <b>Token Name:</b>
                            {tokenMetadata.name}
                        </Label>
                    )}

                    {tokenMetadata.symbol && (
                        <Label>
                            <b>Symbol:</b>
                            {tokenMetadata.symbol}
                        </Label>
                    )}

                    {tokenMetadata.decimals && (
                        <Label>
                            <b>Decimals:</b>
                            {tokenMetadata.decimals!.toString()}
                        </Label>
                    )}

                    {tokenMetadata.granularity && (
                        <Label>
                            <b>Granularity:</b>
                            {tokenMetadata.granularity!.toString()}
                        </Label>
                    )}

                    {tokenMetadata.uri && (
                        <Label>
                            <b>URI:</b>
                            {tokenMetadata.uri}
                        </Label>
                    )}

                    {minRequiredBalance !== undefined && (
                        <Label>
                            <b>Min Token Amount:</b>
                            {minRequiredBalance.toString()}
                        </Label>
                    )}

                    <Label>Staking</Label>
                    <div
                        css={[
                            tw`
                                flex
                            `,
                        ]}
                    >
                        <div
                            css={[
                                tw`
                                    flex-grow
                                `,
                            ]}
                        >
                            <Hint
                                css={[
                                    tw`
                                        pr-16
                                    `,
                                ]}
                            >
                                <Text>
                                    When token staking is enabled, participants will need to deposit
                                    the minimum amount in order to join the room.
                                </Text>
                            </Hint>
                        </div>
                        <div
                            css={[
                                tw`
                                    mt-2
                                `,
                            ]}
                        >
                            <Toggle value={stakingEnabled} />
                        </div>
                    </div>
                </>
            )}

            <Form onSubmit={onSubmit}>
                <>
                    <Label>Privacy</Label>
                    <PrivacySelectField
                        isDisabled={
                            isPrivacyBusy || privacyOption.value === PrivacySetting.TokenGated
                        }
                        value={privacyOption}
                        onChange={(option: any) => {
                            if (
                                !selectedRoomId ||
                                !provider ||
                                !requester ||
                                !streamrClient ||
                                option.value === PrivacySetting.TokenGated
                            ) {
                                return
                            }

                            dispatch(
                                RoomAction.changePrivacy({
                                    roomId: selectedRoomId,
                                    privacy: option.value,
                                    provider,
                                    requester,
                                    streamrClient,
                                    fingerprint: Flag.isPrivacyBeingChanged(selectedRoomId),
                                })
                            )
                        }}
                    />
                </>
                <>
                    <Label>Message storage</Label>
                    <div
                        css={[
                            tw`
                                flex
                            `,
                        ]}
                    >
                        <div
                            css={[
                                tw`
                                    flex-grow
                                `,
                            ]}
                        >
                            <Hint
                                css={[
                                    tw`
                                        pr-16
                                    `,
                                ]}
                            >
                                <Text>
                                    When message storage is disabled, participants will only see
                                    messages sent while they are online.
                                </Text>
                            </Hint>
                        </div>
                        <div
                            css={[
                                tw`
                                    mt-2
                                `,
                            ]}
                        >
                            <Toggle
                                value={isStorageBusy ? undefined : isStorageEnabled}
                                onClick={onStorageToggleClick}
                                busy={isStorageBusy}
                            />
                        </div>
                    </div>
                </>
                <>
                    <Submit label="Ok" />
                </>
            </Form>
        </Modal>
    )
}
