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
import { Address, Prefix, PrivacyOption, PrivacySetting } from '$/types'
import ButtonGroup, { GroupedButton } from '$/components/ButtonGroup'
import PrivacySelectField, {
    privacyOptions,
    PrivateRoomOption,
} from '$/components/PrivacySelectField'
import Modal, { AbortReason, Props as ModalProps } from '$/components/modals/Modal'
import { RoomId } from '$/features/room/types'
import useFlag from '$/hooks/useFlag'
import { Flag } from '$/features/flag/types'
import pathnameToRoomIdPartials from '$/utils/pathnameToRoomIdPartials'
import { TokenType, TokenTypes } from '$/features/tokenGatedRooms/types'
import { useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import { error } from '$/utils/toaster'
import { getTokenType } from '$/features/tokenGatedRooms/utils/getTokenType'

export interface Pin {
    roomId: RoomId
}

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
    onProceed?: (params: Pin | NewRoom) => void
    params?: Pin | NewRoom
}

function getPrivacyOptionForSetting(value: PrivacySetting): PrivacyOption {
    return privacyOptions.find((option) => option.value === value) || PrivateRoomOption
}

export default function AddRoomModal({
    title = 'Add new room',
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

    const [roomId, setRoomId] = useState<string>('roomId' in params ? params.roomId : '')

    useEffect(() => {
        if ('roomId' in params) {
            setRoomId(params.roomId)
            return
        }

        setPrivacySetting(getPrivacyOptionForSetting(params.privacy))

        setRoomName(params.name)

        setStorage(params.storage)
    }, [params])

    const canCreate = !isBlank(roomName)

    const [createNew, setCreateNew] = useState<boolean>(true)

    const isPinning = useFlag(Flag.isRoomBeingPinned())

    const partials = pathnameToRoomIdPartials(roomId)

    const canPin = typeof partials !== 'string' && !isPinning

    const createSubmitLabel = privacySetting.value === PrivacySetting.TokenGated ? 'Next' : 'Create'

    const [isTokenGatedRoom, setIsTokenGatedRoom] = useState<boolean>(false)
    const [tokenAddress] = useState<Address>('')
    const [tokenType, setTokenType] = useState<TokenType>(TokenTypes.unknown)
    const [tokenId, setTokenId] = useState<string>('0')
    const [minRequiredBalance, setMinRequiredBalance] = useState<string>('0')
    const [stakingEnabled, setStakingEnabled] = useState<boolean>(false)

    const provider = useWalletProvider()

    const streamrClient = useWalletClient()

    async function onSubmitCreate() {
        if (!canCreate || !provider || !streamrClient) {
            return
        }

        if (!isTokenGatedRoom && privacySetting.value === PrivacySetting.TokenGated) {
            // display the next window for the token-gated creation
            const tokenType = await getTokenType(tokenAddress, provider)
            if (tokenType.standard !== TokenTypes.unknown.standard) {
                setTokenType(tokenType)
                setCreateNew(false)
                setIsTokenGatedRoom(true)
            } else {
                error(`Token type ${tokenType.standard} not implemented`)
            }
        }
    }

    function onStakingEnabledToggleClick() {
        setStakingEnabled((current) => !current)
    }

    return (
        <Modal
            {...props}
            title={title}
            onBeforeAbort={(reason) => {
                if (reason === AbortReason.Backdrop) {
                    if (createNew) {
                        return (
                            privacySetting === PrivateRoomOption &&
                            isBlank(roomName) &&
                            storage === defaultParams.storage
                        )
                    }

                    return isBlank(roomId)
                }
            }}
        >
            {!isPinning && (
                <ButtonGroup>
                    <GroupedButton active={createNew} onClick={() => void setCreateNew(true)}>
                        Add a room
                    </GroupedButton>
                    <GroupedButton active={!createNew} onClick={() => void setCreateNew(false)}>
                        Pin existing room
                    </GroupedButton>
                </ButtonGroup>
            )}
            {createNew ? (
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
            ) : isTokenGatedRoom ? (
                <Form onSubmit={onSubmitCreate}>
                    <>
                        <Label htmlFor="roomName">Room Name</Label>

                        <TextField id="roomName" value={roomName} readOnly />
                        <Label htmlFor="tokenAddress">Token Address</Label>

                        <TextField id="tokenAddress" value={tokenAddress} readOnly />

                        <Label htmlFor="tokenStandard">Token Standard</Label>

                        <TextField id="tokenStandard" value={tokenType.standard} readOnly />

                        {tokenType.hasIds && (
                            <>
                                <Label htmlFor="tokenId">Token ID</Label>
                                <TextField
                                    id="tokenId"
                                    value={tokenId}
                                    onChange={(e) => void setTokenId(e.target.value)}
                                />
                            </>
                        )}

                        {tokenType.isCountable && (
                            <>
                                <Label htmlFor="minRequiredBalance">Minimum Token Amount</Label>
                                <TextField
                                    id="minRequiredBalance"
                                    value={minRequiredBalance}
                                    onChange={(e) => void setMinRequiredBalance(e.target.value)}
                                />
                            </>
                        )}

                        <>
                            <Label>Enable Staking</Label>
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
                                            When token staking is enabled, participants will need to
                                            deposit the minimum amount in order to join the room.
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
                                        value={stakingEnabled}
                                        onClick={onStakingEnabledToggleClick}
                                    />
                                </div>
                            </div>
                        </>

                        <Submit label="Create" disabled={false} />
                    </>
                </Form>
            ) : (
                <Form
                    onSubmit={() => {
                        if (!canPin) {
                            return
                        }

                        onProceed?.({
                            roomId: `${partials.account}/${Prefix.Room}/${partials.uuid}`,
                        })
                    }}
                >
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
