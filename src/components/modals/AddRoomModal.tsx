import { useEffect, useState } from 'react'
import tw from 'twin.macro'
import isBlank from '$/utils/isBlank'
import Form from '../Form'
import Hint from '../Hint'
import Label from '../Label'
import Submit from '../Submit'
import Text from '../Text'
import TextField from '../TextField'
import Toggle from '../Toggle'
import { PrivacyOption, PrivacySetting } from '$/types'
import PrivacySelectField, {
    privacyOptions,
    PrivateRoomOption,
} from '$/components/PrivacySelectField'
import Modal, { AbortReason, Props as ModalProps } from '$/components/modals/Modal'
import { I18n } from '$/utils/I18n'

export interface NewRoom {
    name: string
    privacy: PrivacySetting
    storage: boolean
}

export const defaultParams: NewRoom = {
    name: '',
    privacy: PrivacySetting.Private,
    storage: true,
}

interface Props extends ModalProps {
    onProceed?: (params: NewRoom) => void
    params?: NewRoom
}

function getPrivacyOptionForSetting(value: PrivacySetting): PrivacyOption {
    return privacyOptions.find((option) => option.value === value) || PrivateRoomOption
}

export default function AddRoomModal({
    title = I18n.addRoomModal.title(),
    params = defaultParams,
    onProceed,
    ...props
}: Props) {
    const [privacySetting, setPrivacySetting] = useState<PrivacyOption>(
        getPrivacyOptionForSetting('privacy' in params ? params.privacy : defaultParams.privacy)
    )

    const [roomName, setRoomName] = useState<string>(
        'name' in params ? params.name : defaultParams.name
    )

    const [storage, setStorage] = useState<boolean>(
        'storage' in params ? params.storage : defaultParams.storage
    )

    useEffect(() => {
        setPrivacySetting(getPrivacyOptionForSetting(params.privacy))

        setRoomName(params.name)

        setStorage(params.storage)
    }, [params])

    const canCreate = !isBlank(roomName)

    const createSubmitLabel =
        privacySetting.value === PrivacySetting.TokenGated
            ? I18n.addRoomModal.nextButtonLabel()
            : I18n.addRoomModal.createButtonLabel()

    return (
        <Modal
            {...props}
            title={title}
            onBeforeAbort={(reason) => {
                if (reason === AbortReason.Backdrop) {
                    return (
                        privacySetting === PrivateRoomOption &&
                        isBlank(roomName) &&
                        storage === defaultParams.storage
                    )
                }
            }}
        >
            <Form
                onSubmit={() => {
                    if (!canCreate) {
                        return
                    }

                    onProceed?.({
                        name: roomName,
                        storage,
                        privacy: privacySetting.value,
                    })
                }}
            >
                <>
                    <Label htmlFor="roomName">Name</Label>
                    <TextField
                        placeholder={I18n.addRoomModal.roomFieldPlaceholder()}
                        id="roomName"
                        value={roomName}
                        onChange={(e) => void setRoomName(e.target.value)}
                        autoFocus
                    />
                    <Hint>{I18n.addRoomModal.roomFieldHint()}</Hint>
                </>
                <>
                    <Label>{I18n.addRoomModal.privacyFieldLabel()}</Label>
                    <PrivacySelectField
                        value={privacySetting}
                        onChange={(option) => void setPrivacySetting(option as PrivacyOption)}
                    />
                </>
                <>
                    <Label>{I18n.addRoomModal.storageFieldLabel()}</Label>
                    <div css={tw`flex`}>
                        <div css={tw`grow`}>
                            <Hint css={tw`pr-16`}>
                                <Text>{I18n.addRoomModal.storageFieldHint()}</Text>
                            </Hint>
                        </div>
                        <div css={tw`mt-2`}>
                            <Toggle
                                value={storage}
                                onClick={() => {
                                    setStorage((c) => !c)
                                }}
                            />
                        </div>
                    </div>
                </>
                <>
                    <Submit label={createSubmitLabel} disabled={!canCreate} />
                </>
            </Form>
        </Modal>
    )
}

AddRoomModal.displayName = 'AddRoomModal'
