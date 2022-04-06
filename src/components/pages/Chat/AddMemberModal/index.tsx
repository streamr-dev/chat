import React from 'react'
import { useState } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { KARELIA } from '../../../../utils/css'
import useInviter from '../../../../hooks/useInviter'
import { useStore } from '../../../Store'
import { useSend } from '../MessageTransmitter'
import { MetadataType } from '../MessageAggregator'
import { Partition } from '../../../../utils/types'

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: '100000',
    },
    content: {
        border: 'none',
        width: '528px',
        height: '291px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        borderRadius: '20px',
        transform: 'translate(-50%, -50%)',
        fontFamily: `${KARELIA}`,
        overflow: 'hidden',
    },
}

const CreateButton = styled.button`
    align-items: center;
    background: #ff5924;
    border-radius: 100px;
    border: none;
    box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.1);
    color: white;
    display: inline-flex;
    height: auto;
    font-family: ${KARELIA};
    font-size: 18px;
    padding: 10px 30px;

    :hover,
    :focus {
        background-color: #de4716;
    }

    div {
        margin-right: 16px;
        transform: translateY(-0.1em);
    }

    svg {
        display: block;
    }
`

const Subheading = styled.h3`
    color: #36404e;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 7px;
`

const CloseButton = styled.button`
    background-color: transparent;
    border: none;
`

const StyledModalContent = styled.div`
    display: flex;

    input {
        appearance: none;
        background: #dee6ee;
        border: 0;
        outline: 0;
        width: 100%;
        padding: 13px 16px;
        font-size: 16px;
        border-radius: 8px;
        margin-bottom: 40px;
    }

    ${CreateButton} {
        float: right;
    }
`

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100%;
    height: 440px;
    padding: 0px 20px;
    width: 100%;
`

const ModalHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const AddMemberModal = ({
    button,
    isOpen = false,
    handleModal,
}: {
    button?: React.ReactElement<any>
    isOpen?: boolean
    handleModal?: (state: boolean) => void
}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [memberAddress, setMemberAddress] = useState('')

    const { metamaskStreamrClient, roomId } = useStore()

    const invite = useInviter()

    const closeModal = () => {
        setModalIsOpen(false)
        handleModal && handleModal(false)
    }

    const openModal = () => {
        setModalIsOpen(true)
    }

    const send = useSend()

    return (
        <>
            {button ? (
                React.cloneElement(button!, { onClick: openModal })
            ) : (
                <></>
            )}
            <ReactModal
                ariaHideApp={false}
                isOpen={modalIsOpen || isOpen}
                appElement={document.getElementById('root') as HTMLElement}
                contentLabel="Connect a wallet"
                style={customStyles}
            >
                <StyledModalContent>
                    <ModalContainer>
                        <ModalHeader>
                            <h2>Add member</h2>
                            <CloseButton onClick={closeModal}>
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
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M1 1L15 15"
                                        stroke="#59799C"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </CloseButton>
                        </ModalHeader>
                        <div>
                            <Subheading>Member Address</Subheading>
                            <input
                                placeholder="Member Address"
                                onChange={(e) => {
                                    setMemberAddress(e.target.value)
                                }}
                                value={memberAddress}
                            />
                            <CreateButton
                                onClick={async () => {
                                    const stream =
                                        await metamaskStreamrClient!.getStream(
                                            roomId!
                                        )
                                    await invite({
                                        invitees: [memberAddress],
                                        stream: stream,
                                    })

                                    send(MetadataType.SendInvite, {
                                        streamPartition: Partition.Metadata,
                                        streamId: roomId,
                                        data: memberAddress,
                                    })

                                    closeModal()
                                }}
                            >
                                Add
                            </CreateButton>
                        </div>
                    </ModalContainer>
                </StyledModalContent>
            </ReactModal>
        </>
    )
}

export default AddMemberModal
