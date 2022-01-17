import React, { useState } from 'react'
import ReactModal from 'react-modal'
import Modal from 'react-modal'
import styled from 'styled-components'
import { KARELIA } from '../../utils/css'
import MemberOptions from './MemberOptions'

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

const StyledModalContent = styled.div`
    .contentContainer {
        display: flex;
        flex-direction: column;
        padding: 0px 20px;
    }
    .closeButton {
        background-color: transparent;
        border: none;
    }
    .modalHeader {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .memberList {
        display: flex;
        flex-direction: column;
        overflow: auto;
        height: 300px;
    }
    .walletOption {
        background-color: #f1f4f7;
        margin-top: 8px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        flex: 1;
        padding: 0px 32px;
        border-radius: 8px;
        justify-content: space-between;
        font-size: 16px;
        font-family: IBM Plex Sans;
        font-weight: bold;
    }
    .walletOption:hover {
        background-color: #dfe3e8;
    }
`

const UnstyledMemberModal = ({ button }: any) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const openModal = () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    return (
        <div>
            {React.cloneElement(button, { onClick: openModal }) || (
                <button onClick={openModal}>Connect a Wallet</button>
            )}
        </div>
    )
}

const MemberModal = styled(UnstyledMemberModal)`
    button {
        background: white;
        border-radius: 100px;
        border: none;
        color: #ff5924;
        font-family: ${KARELIA};
        font-size: 15px;
        height: 100%;
        padding: 10px 30px 13px;
        transition: all 0.3s ease-in-out;
    }
    button:hover,
    button:focus {
        background-color: #f7f7f7;
        transform: translateY(5px);
    }
`

export default MemberModal
