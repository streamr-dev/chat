import { useState } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { AddMemberIcon } from '../../../../icons'
import { KARELIA, MEDIUM } from '../../../../utils/css'
import Button from '../../../Button'

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    },
}

const AddMemberButton = styled(Button)`
    align-items: center;
    background: rgba(255, 89, 36, 0.08);
    border-radius: 1.5rem;
    color: #ff5924;
    cursor: pointer;
    display: flex;
    margin: 0 auto;
    padding: 0 2rem;

    span {
        display: block;
        font-family: ${KARELIA};
        font-size: 1.125rem;
        font-weight: ${MEDIUM};
        transform: translateY(-0.1em);
    }

    svg {
        display: block;
        margin-right: 0.75rem;
    }
`

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

const AddMemberModal = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const openModal = () => {
        setModalIsOpen(true)
    }

    return (
        <>
            <AddMemberButton type="button" onClick={openModal}>
                <AddMemberIcon />
                <span>Add member</span>
            </AddMemberButton>
            <ReactModal
                isOpen={modalIsOpen}
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
                            </CloseButton>
                        </ModalHeader>
                        <div>
                            <Subheading>Member Address</Subheading>
                            <input placeholder="Member Address" />
                            <CreateButton onClick={() => {}}>Add</CreateButton>
                        </div>
                    </ModalContainer>
                </StyledModalContent>
            </ReactModal>
        </>
    )
}

export default AddMemberModal
