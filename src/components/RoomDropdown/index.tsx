import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import {
    AddMemberIcon,
    EditMembersIcon,
    SearchIcon,
    DownloadIcon,
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

const RoomDropdown = ({ button }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [memberModalIsOpen, setMemberModalIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const {
        roomId,
        session: { streamrClient },
    } = useStore()

    const [members, setMembers] = useState(Array<string>())

    useEffect(() => {
        const fn = async () => {
            if (!streamrClient || !roomId || members.length > 0) {
                return
            }
            const stream = await streamrClient.getStream(roomId)
            setMembers(await getRoomMembersFromStream(stream))
        }

        fn()
    })

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref])

    const openModal = () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const handleMemberModal = (state: boolean) => {
        setMemberModalIsOpen(state)
    }

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <DropDownContainer>
                <RoomAction type="button" onClick={toggleOpen}>
                    <MoreIcon />
                </RoomAction>
                {isOpen && (
                    <DropDownListContainer ref={ref}>
                        <DropDownList>
                            <ListItem
                                onClick={() => {
                                    handleMemberModal(true)
                                }}
                            >
                                <AddMemberIcon />
                                Add member
                            </ListItem>
                            <ListItem onClick={openModal}>
                                <EditMembersIcon />
                                Edit members
                            </ListItem>
                            <hr></hr>
                            <ListItem>
                                <SearchIcon />
                                Search in conversation
                            </ListItem>
                            <ListItem>
                                <DownloadIcon />
                                Save to local
                            </ListItem>
                            <ListItem>
                                <CopyIcon />
                                Copy room id
                            </ListItem>
                            <hr></hr>
                            <ListItem>
                                <DeleteIcon />
                                Delete room
                            </ListItem>
                        </DropDownList>
                    </DropDownListContainer>
                )}
            </DropDownContainer>

            <AddMemberModal
                isOpen={memberModalIsOpen}
                handleModal={handleMemberModal}
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
                        <ModalCloseButton onClick={closeModal}>
                            <CloseIcon />
                        </ModalCloseButton>
                    </ModalHeader>
                    <MemberList>
                        {members.map((member) => {
                            return (
                                <MemberOptions key={member} address={member} />
                            )
                        })}
                    </MemberList>
                </StyledModalContent>
            </ReactModal>
        </>
    )
}

export default RoomDropdown
