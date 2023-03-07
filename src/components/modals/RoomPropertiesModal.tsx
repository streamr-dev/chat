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
import useTokenMetadata from '$/hooks/useTokenMetadata'
import { MiscAction } from '$/features/misc'
import TextField from '$/components/TextField'
import i18n from '$/utils/I18n'

export default function RoomPropertiesModal({
    title = i18n('roomPropertiesModal.title'),
    subtitle = i18n('common.fallbackRoomName'),
    onAbort,
    ...props
}: ModalProps) {
    const selectedRoomId = useSelectedRoomId()

    const {
        name: roomName = '',
        tokenAddress,
        minRequiredBalance,
        tokenType,
        tokenIds = [],
        stakingEnabled = false,
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
    }, [open, selectedRoomId])

    const tokenMetadata = useTokenMetadata(tokenAddress, tokenIds)

    useEffect(() => {
        if (!tokenAddress || !tokenType || !provider || !tokenIds) {
            return
        }

        dispatch(
            MiscAction.fetchTokenMetadata({
                tokenAddress,
                tokenStandard: tokenType.standard,
                provider,
                tokenIds,
                fingerprint: Flag.isFetchingTokenMetadata(tokenAddress, tokenIds),
            })
        )
    }, [tokenAddress, tokenType, provider, tokenIds, tokenMetadata])

    return (
        <Modal {...props} onAbort={onAbort} title={title} subtitle={roomName || subtitle}>
            {tokenMetadata ? (
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
                    {'name' in tokenMetadata && tokenMetadata.name && (
                        <Label>
                            <b>Token Name:</b>
                            {tokenMetadata.name}
                        </Label>
                    )}
                    {'symbol' in tokenMetadata && tokenMetadata.symbol && (
                        <Label>
                            <b>Symbol:</b>
                            {tokenMetadata.symbol}
                        </Label>
                    )}
                    {'decimals' in tokenMetadata && tokenMetadata.decimals && (
                        <Label>
                            <b>Decimals:</b>
                            {tokenMetadata.decimals}
                        </Label>
                    )}
                    {'granularity' in tokenMetadata && tokenMetadata.granularity && (
                        <Label>
                            <b>Granularity:</b>
                            {tokenMetadata.granularity}
                        </Label>
                    )}
                    {'uris' in tokenMetadata && tokenMetadata.uris && (
                        <>
                            {Object.entries(tokenMetadata.uris).map(([tokenId, uri]) => (
                                <Label key={tokenId}>
                                    <b>URI:</b>
                                    {uri}
                                </Label>
                            ))}
                        </>
                    )}
                    {minRequiredBalance !== undefined && (
                        <Label>
                            <b>Min Token Amount:</b>
                            {minRequiredBalance.toString()}
                        </Label>
                    )}
                    <Label>{i18n('roomPropertiesModal.stakingLabel')}</Label>
                    <div css={tw`flex`}>
                        <div css={tw`grow`}>
                            <Hint css={tw`pr-16`}>
                                <Text>{i18n('addTokenGatedRoomModal.stakingDesc')}</Text>
                            </Hint>
                        </div>
                        <div css={tw`mt-2`}>
                            <Toggle value={stakingEnabled} />
                        </div>
                    </div>
                </>
            ) : null}
            <Form onSubmit={() => void onAbort?.()}>
                {!!selectedRoomId && (
                    <>
                        <Label>{i18n('roomPropertiesModal.roomIdLabel')}</Label>
                        <TextField defaultValue={selectedRoomId} readOnly />
                    </>
                )}
                <>
                    <Label>{i18n('addRoomModal.storageFieldLabel')}</Label>
                    <div css={tw`flex`}>
                        <div css={tw`grow`}>
                            <Hint css={tw`pr-16`}>
                                <Text>{i18n('addRoomModal.storageFieldHint')}</Text>
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
                    <Submit label={i18n('roomPropertiesModal.dismissButtonLabel')} />
                </>
            </Form>
        </Modal>
    )
}

RoomPropertiesModal.displayName = 'RoomPropertiesModal'
