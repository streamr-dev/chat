import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { STREAMR_STORAGE_NODE_GERMANY } from 'streamr-client'
import tw from 'twin.macro'
import { PrivacySetting } from '../../../types/common'
import { RoomAction } from '../../features/room'
import {
    useChangingPrivacy,
    useGettingPrivacy,
    useGettingStorageNodes,
    usePrivacy,
    useSelectedRoomId,
    useStorageNodeState,
    useStorageNodeToggling,
} from '../../features/room/hooks'
import useSelectedRoom from '../../hooks/useSelectedRoom'
import Form from '../Form'
import Hint from '../Hint'
import Label from '../Label'
import SelectField from '../SelectField'
import Submit from '../Submit'
import Text from '../Text'
import Toggle from '../Toggle'
import {
    privacyOptions,
    SingleValue,
    Option,
    PrivateRoomOption,
    PublicRoomOption,
} from './AddRoomModal'
import Modal, { ModalProps } from './Modal'

export default function RoomPropertiesModal({ open, setOpen, ...props }: ModalProps) {
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

    function onStorageToggleClick() {
        if (!selectedRoomId || isStorageBusy) {
            return
        }

        dispatch(
            RoomAction.toggleStorageNode({
                roomId: selectedRoomId,
                address: STREAMR_STORAGE_NODE_GERMANY,
                state: !isStorageEnabled,
            })
        )
    }

    useEffect(() => {
        if (!open || !selectedRoomId) {
            return
        }

        dispatch(RoomAction.getStorageNodes(selectedRoomId))

        dispatch(RoomAction.getPrivacy(selectedRoomId))
    }, [open, selectedRoomId])

    const privacyOption =
        usePrivacy(selectedRoomId) === PrivacySetting.Public ? PublicRoomOption : PrivateRoomOption

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
            <Form onSubmit={onSubmit}>
                <>
                    <Label>Privacy</Label>
                    <SelectField
                        isDisabled={isPrivacyBusy}
                        options={privacyOptions}
                        value={privacyOption}
                        onChange={(option: any) => {
                            if (!selectedRoomId) {
                                return
                            }

                            dispatch(
                                RoomAction.changePrivacy({
                                    roomId: selectedRoomId,
                                    privacy: option.value,
                                })
                            )
                        }}
                        optionComponent={Option}
                        singleValueComponent={SingleValue}
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
