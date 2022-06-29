import { useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import isBlank from '$/utils/isBlank'
import Form from '../Form'
import Hint from '../Hint'
import Label from '../Label'
import Modal, { ModalProps } from './Modal'
import Submit from '../Submit'
import Text from '../Text'
import TextField from '../TextField'
import Toggle from '../Toggle'
import { v4 as uuidv4 } from 'uuid'
import { Prefix, PrivacyOption } from '$/types'
import { RoomAction } from '$/features/room'
import ButtonGroup, { GroupedButton } from '$/components/ButtonGroup'
import { Flag } from '$/features/flag/types'
import PrivacySelectField, { PrivateRoomOption } from '$/components/PrivacySelectField'

export default function AddRoomModal({ setOpen, ...props }: ModalProps) {
    const [privacySetting, setPrivacySetting] = useState<PrivacyOption>(PrivateRoomOption)

    const [roomName, setRoomName] = useState<string>('')

    const canCreate = !isBlank(roomName)

    const dispatch = useDispatch()

    const account = useWalletAccount()

    const [storage, setStorage] = useState<boolean>(false)

    function onStorageToggleClick() {
        setStorage((current) => !current)
    }

    const [createNew, setCreateNew] = useState<boolean>(true)

    const [roomId, setRoomId] = useState<string>('')

    const canPin = !isBlank(roomId)

    function onClose() {
        setRoomName('')
        setPrivacySetting(PrivateRoomOption)
        setRoomId('')
    }

    const provider = useWalletProvider()

    const streamrClient = useWalletClient()

    function onSubmitCreate() {
        if (!canCreate || !provider || !streamrClient || !account) {
            return
        }

        const now = Date.now()

        dispatch(
            RoomAction.create({
                params: {
                    createdAt: now,
                    createdBy: account!,
                    id: `/${Prefix.Room}/${uuidv4()}`,
                    name: roomName,
                    owner: account!,
                    updatedAt: now,
                },
                privacy: privacySetting.value,
                storage,
                provider,
                requester: account,
                streamrClient,
            })
        )

        if (typeof setOpen === 'function') {
            setOpen(false)
            onClose()
        }
    }

    function onSubmitPin() {
        if (!canPin || !account || !streamrClient) {
            return
        }

        dispatch(
            RoomAction.pin({
                roomId,
                requester: account,
                streamrClient,
                fingerprint: Flag.isRoomBeingPinned(roomId, account),
            })
        )

        if (typeof setOpen === 'function') {
            setOpen(false)
            onClose()
        }
    }

    return (
        <Modal {...props} title="Add new room" setOpen={setOpen} onClose={onClose}>
            <ButtonGroup>
                <GroupedButton active={createNew} onClick={() => void setCreateNew(true)}>
                    Add a room
                </GroupedButton>
                <GroupedButton active={!createNew} onClick={() => void setCreateNew(false)}>
                    Pin existing room
                </GroupedButton>
            </ButtonGroup>
            {createNew ? (
                <Form onSubmit={onSubmitCreate}>
                    <>
                        <Label htmlFor="roomName">Name</Label>
                        <TextField
                            placeholder="e.g. giggling-bear"
                            id="roomName"
                            value={roomName}
                            onChange={(e) => void setRoomName(e.target.value)}
                            autoFocus
                        />
                        <Hint>The room name will be publicly visible.</Hint>
                    </>
                    <>
                        <Label>Choose privacy</Label>
                        <PrivacySelectField
                            value={privacySetting}
                            onChange={(option) => void setPrivacySetting(option as PrivacyOption)}
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
                                <Toggle value={storage} onClick={onStorageToggleClick} />
                            </div>
                        </div>
                    </>
                    <>
                        <Submit label="Create" disabled={!canCreate} />
                    </>
                </Form>
            ) : (
                <Form onSubmit={onSubmitPin}>
                    <>
                        <Label htmlFor="roomId">Room ID</Label>
                        <TextField
                            id="roomId"
                            value={roomId}
                            onChange={(e) => void setRoomId(e.target.value)}
                            autoFocus
                            autoComplete="off"
                        />
                    </>
                    <>
                        <Submit label="Pin" disabled={!canPin} />
                    </>
                </Form>
            )}
        </Modal>
    )
}
