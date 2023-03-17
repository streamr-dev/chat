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
import { useWalletAccount } from '$/features/wallet/hooks'
import { Flag } from '$/features/flag/types'
import TextField from '$/components/TextField'
import i18n from '$/utils/i18n'
import useRoomEntryRequirements from '$/hooks/useRoomEntryRequirements'
import TokenLogo from '$/components/TokenLogo'
import TokenStandardLabel from '$/components/TokenStandardLabel'
import { RoomId } from '$/features/room/types'
import useCachedTokenGate from '$/hooks/useCachedTokenGate'
import trunc from '$/utils/trunc'
import TokenLabel from '$/components/TokenLabel'
import useFetchingTokenMetadataForAnyTokenId from '$/hooks/useFetchingTokenMetadataForAnyTokenId'

export default function RoomPropertiesModal({
    title = i18n('roomPropertiesModal.title'),
    subtitle = i18n('common.fallbackRoomName'),
    onAbort,
    ...props
}: ModalProps) {
    const selectedRoomId = useSelectedRoomId()

    const { name: roomName = '' } = useSelectedRoom() || {}

    const isStorageEnabled = useStorageNodeState(selectedRoomId, STREAMR_STORAGE_NODE_GERMANY)

    const isGettingStorageNodes = useGettingStorageNodes(selectedRoomId)

    const isTogglingStorageNode = useStorageNodeToggling(
        selectedRoomId,
        STREAMR_STORAGE_NODE_GERMANY
    )

    const isStorageBusy = isTogglingStorageNode || isGettingStorageNodes

    const dispatch = useDispatch()

    const requester = useWalletAccount()

    function onStorageToggleClick() {
        if (!selectedRoomId || isStorageBusy || !requester) {
            return
        }

        dispatch(
            RoomAction.toggleStorageNode({
                roomId: selectedRoomId,
                address: STREAMR_STORAGE_NODE_GERMANY,
                state: !isStorageEnabled,
                requester,
                fingerprint: Flag.isTogglingStorageNode(
                    selectedRoomId,
                    STREAMR_STORAGE_NODE_GERMANY
                ),
            })
        )
    }

    useEffect(() => {
        if (!open || !selectedRoomId) {
            return
        }

        dispatch(
            RoomAction.getStorageNodes({
                roomId: selectedRoomId,
                fingerprint: Flag.isGettingStorageNodes(selectedRoomId),
            })
        )
    }, [open, selectedRoomId])

    return (
        <Modal {...props} onAbort={onAbort} title={title} subtitle={roomName || subtitle}>
            <Form onSubmit={() => void onAbort?.()}>
                {!!selectedRoomId && (
                    <>
                        <Label>{i18n('roomPropertiesModal.roomIdLabel')}</Label>
                        <TextField defaultValue={selectedRoomId} readOnly />
                    </>
                )}
                <TokenGateSummary roomId={selectedRoomId} />
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

function TokenGateSummary({ roomId }: { roomId: RoomId | undefined }) {
    const tokenGate = useCachedTokenGate(roomId)

    const entryReq = useRoomEntryRequirements(roomId)

    const isFetching = useFetchingTokenMetadataForAnyTokenId(tokenGate?.tokenAddress)

    if (!tokenGate) {
        return null
    }

    const { tokenAddress, stakingEnabled } = tokenGate

    return (
        <>
            <Label>{i18n('roomPropertiesModal.tokenGateLabel')}</Label>
            <div
                css={tw`
                    [img]:mr-3
                    border
                    border-[#F1F4F7]
                    flex
                    h-[64px]
                    items-center
                    px-4
                    rounded-lg
                    text-[#36404E]
                    text-[14px]
                `}
            >
                <TokenLogo tokenAddress={tokenAddress} />
                <div css={tw`mr-6 grow`}>
                    <div css={tw`font-semibold`}>
                        <Text
                            truncate
                            css={[
                                tw`leading-normal`,
                                isFetching &&
                                    tw`
                                        animate-pulse
                                        [animation-duration: 0.5s]
                                    `,
                            ]}
                        >
                            {isFetching ? (
                                i18n('common.load', true)
                            ) : !entryReq ? (
                                <>Failed to load</>
                            ) : (
                                <>
                                    {typeof entryReq.quantity === 'string' && (
                                        <>{entryReq.quantity} </>
                                    )}
                                    {entryReq.unit}
                                </>
                            )}
                        </Text>
                    </div>
                    <div css={tw`text-[#59799C]`}>
                        <Text>{trunc(tokenAddress)}</Text>
                    </div>
                </div>
                <TokenStandardLabel tokenAddress={tokenAddress} css={tw`mr-1.5`} />
                {stakingEnabled && (
                    <TokenLabel as="div" css={tw`uppercase`}>
                        <Text>{i18n('roomPropertiesModal.stakingLabel')}</Text>
                    </TokenLabel>
                )}
            </div>
        </>
    )
}
