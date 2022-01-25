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
} from '../../icons'
import { KARELIA } from '../../utils/css'
import MemberOptions from './MemberOptions'

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

const members = [
    {
        address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    },
    {
        address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    },
    {
        address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    },
    {
        address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    },
    {
        address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    },
]

const DropDownContainer = styled.div`
    margin-left: 10px;
`

const DropDownHeader = styled.div`
    margin-bottom: 0.8em;
    padding: 0 2em 0 1em;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
    font-weight: 500;
    font-size: 1.3rem;
    color: #3faffa;
    background: #ffffff;
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
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref])

    const openModal = () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <DropDownContainer>
                {React.cloneElement(button, { onClick: toggleOpen }) || (
                    <DropDownHeader onClick={toggleOpen}>
                        Mangoes
                    </DropDownHeader>
                )}
                {isOpen && (
                    <DropDownListContainer ref={ref}>
                        <DropDownList>
                            <ListItem>
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

            <ReactModal
                isOpen={modalIsOpen}
                contentLabel="Connect a wallet"
                style={customStyles}
                onRequestClose={closeModal}
            >
                <StyledModalContent>
                    <ModalHeader>
                        <h2>Edit members</h2>
                        <ModalCloseButton onClick={closeModal}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 1L0.999999 15"
                                    stroke="#59799C"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M1 1L15 15"
                                    stroke="#59799C"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </ModalCloseButton>
                    </ModalHeader>
                    <MemberList>
                        {members.map((member) => {
                            return <MemberOptions address={member.address} />
                        })}
                    </MemberList>
                </StyledModalContent>
            </ReactModal>
        </>
    )
}

export default RoomDropdown
