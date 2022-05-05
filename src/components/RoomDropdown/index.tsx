import { useEffect, useReducer, useRef } from 'react'
import { useState } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import {
    AddMemberIcon,
    EditMembersIcon,
    CopyIcon,
    DeleteIcon,
    MoreIcon,
} from '../../icons'
import { KARELIA } from '../../utils/css'
import MemberOptions from './MemberOptions'
import CloseIcon from '../../icons/CloseIcon'
import RoomAction from '../pages/Chat/RoomAction'
import AddMemberModal from '../pages/Chat/AddMemberModal'
import { useStore } from '../Store'
import getRoomMembersFromStream from '../../getters/getRoomMembersFromStream'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import useDeleteRoom from '../../hooks/useDeleteRoom'
import useGetOnlineRoomMembers from '../../hooks/useGetOnlineRoomMembers'
import { toast } from 'react-toastify'
import getRoomMetadata from '../../getters/getRoomMetadata'
import { RoomPrivacy } from '../../utils/types'

type Props = {
    button?: any
}

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: '1000',
    },
    content: {
        border: 'none',
        width: '528px',
        height: '456px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        borderRadius: '20px',
        transform: 'translate(-50%, -50%)',
        fontFamily: `${KARELIA}`,
    },
}

const DropDownContainer = styled.div`
    margin-left: 10px;
`

const DropDownListContainer = styled.div`
    position: absolute;
    top: 75px;
    right: 35px;
    z-index: 100;
`

const DropDownList = styled.div`
    width: 250px;
    padding: 0;
    margin: 0;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    color: #59799c;
    font-family: ${KARELIA};
    font-size: 14px;
    list-style-type: none;
    border-spacing: 0px;

    hr {
        border: 0;
        border-top: 1px solid #dee6ee;
        padding: 0px;
        margin: 0px;
    }
`

const ListItem = styled.div`
    padding: 10px 15px;
    background-clip: padding-box;
    align-items: center;
    display: flex;
    cursor: pointer;

    :first-child {
        padding-top: 15px;
        border-radius: 10px 10px 0 0;
    }

    :last-child {
        padding-bottom: 15px;
        border-radius: 0 0 10px 10px;
    }

    :hover {
        background-color: #f1f4f7;
    }

    svg {
        width: 1rem;
        margin-right: 0.75rem;
    }
`

const StyledModalContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 20px;
`

const ModalCloseButton = styled.button`
    background-color: transparent;
    border: none;
`

const ModalHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const MemberList = styled.div`
    display: flex;
    flex-direction: column;
    height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
`

const CursorPointer = {
    cursor: 'pointer',
}

const RoomDropdown = ({ button }: Props) => {
    const [isOpen, toggleOpen] = useReducer((current) => !current, false)

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [memberModalIsOpen, setMemberModalIsOpen] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>(null)

    const {
        roomId,
        account,
        session: { streamrClient },
    } = useStore()

    const [members, setMembers] = useState(Array<string>())
    const [isRoomOwner, setIsRoomOwner] = useState(false)
    const [roomPrivacy, setRoomPrivacy] = useState<RoomPrivacy>()
    const getOnlineRoomMembers = useGetOnlineRoomMembers()
    const [onlineMembers, setOnlineMembers] = useState(Array<string>())
    useEffect(() => {
        let mounted = true

        const fn = async () => {
            if (!streamrClient || !roomId || !account) {
                return
            }

            // go checking mountpoint??
            const stream = await streamrClient.getStream(roomId)

            if (!mounted) {
                return
            }

            // parse and assign the privacy
            const { privacy } = getRoomMetadata(stream.description!)
            setRoomPrivacy(privacy)

            // check if owner
            setIsRoomOwner(stream.id.includes(account))

            // get room members
            const members = await getRoomMembersFromStream(stream)
            if (!mounted) {
                return
            }
            setMembers(members)

            // get online members
            const onlineMembers = await getOnlineRoomMembers({
                streamId: stream.id,
            })
            if (!mounted) {
                return
            }
            setOnlineMembers(onlineMembers)
        }

        fn()

        return () => {
            mounted = false
        }
    }, [account, getOnlineRoomMembers, roomId, streamrClient])

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                toggleOpen()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref])

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const deleteRoom = useDeleteRoom()

    const clickDeleteRoom = () => {
        if (!roomId) {
            return
        }
        deleteRoom(roomId)
        toggleOpen()
    }

    const onRoomIdCopied = async () => {
        toast.info(`Room ID copied to clipboard: ${roomId!}`, {
            position: 'top-center',
        })
        toggleOpen()
    }

    return (
        <>
            <DropDownContainer>
                <RoomAction
                    style={CursorPointer}
                    type="button"
                    onClick={toggleOpen}
                >
                    <MoreIcon />
                </RoomAction>
                {isOpen && (
                    <DropDownListContainer ref={ref}>
                        <DropDownList>
                            {roomPrivacy !== RoomPrivacy.Public && (
                                <>
                                    <ListItem
                                        onClick={() =>
                                            void setMemberModalIsOpen(true)
                                        }
                                    >
                                        <AddMemberIcon />
                                        Add member
                                    </ListItem>
                                    <ListItem
                                        onClick={() =>
                                            void setModalIsOpen(true)
                                        }
                                    >
                                        <EditMembersIcon />
                                        Edit members
                                    </ListItem>
                                    <hr></hr>
                                </>
                            )}
                            <ListItem>
                                <CopyToClipboard
                                    text={roomId!}
                                    onCopy={onRoomIdCopied}
                                >
                                    <div>
                                        <CopyIcon />
                                        Copy room id
                                    </div>
                                </CopyToClipboard>
                            </ListItem>
                            <hr></hr>
                            {isRoomOwner ? (
                                <ListItem onClick={clickDeleteRoom}>
                                    <DeleteIcon />
                                    Delete room
                                </ListItem>
                            ) : null}
                        </DropDownList>
                    </DropDownListContainer>
                )}
            </DropDownContainer>
            <AddMemberModal
                isOpen={memberModalIsOpen}
                handleModal={(open) => void setMemberModalIsOpen(open)}
            />
            <ReactModal
                isOpen={modalIsOpen}
                contentLabel="Connect a wallet"
                style={customStyles}
                onRequestClose={closeModal}
                appElement={document.getElementById('root') as HTMLElement}
            >
                <StyledModalContent>
                    <ModalHeader>
                        <h2>Edit members</h2>
                        <ModalCloseButton
                            style={CursorPointer}
                            onClick={closeModal}
                        >
                            <CloseIcon />
                        </ModalCloseButton>
                    </ModalHeader>
                    <MemberList>
                        {members.map((member) => {
                            return (
                                <MemberOptions
                                    key={member}
                                    address={member}
                                    isOnline={onlineMembers.includes(member)}
                                />
                            )
                        })}
                    </MemberList>
                </StyledModalContent>
            </ReactModal>
        </>
    )
}

export default RoomDropdown
