import React, { ReactElement, useState } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { KARELIA } from '../../utils/css'
import metamask from './icons/metamask.png'
import keystone from './icons/keystone.png'
import coinbase from './icons/coinbase.png'
import walletconnect from './icons/walletconnect.png'

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    content: {
        border: 'none',
        width: '528px',
        height: '558px',
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
        min-height: 100%;
        height: 440px;
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
    .walletOptions {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: auto;
        min-height: 100%;
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

const UnstyledWalletModal = ({ button }: { button?: ReactElement }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const openModal = () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    return (
        <div>
            {button ? (
                React.cloneElement(button, { onClick: openModal })
            ) : (
                <button onClick={openModal} className="button">
                    Connect a Wallet
                </button>
            )}
            <ReactModal
                isOpen={modalIsOpen}
                contentLabel="Connect a wallet"
                style={customStyles}
            >
                <StyledModalContent>
                    <div className="contentContainer">
                        <div className="modalHeader">
                            <h2>Select a wallet</h2>
                            <button
                                className="closeButton"
                                onClick={closeModal}
                            >
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
                            </button>
                        </div>
                        <div className="walletOptions">
                            <div className="walletOption">
                                Metamask
                                <img
                                    src={metamask}
                                    width={40}
                                    alt="Metamask Logo"
                                />
                            </div>
                            <div className="walletOption">
                                WalletConnect
                                <img
                                    src={walletconnect}
                                    width={40}
                                    alt="WalletConnect Logo"
                                />
                            </div>
                            <div className="walletOption">
                                Keystone
                                <img
                                    src={keystone}
                                    width={40}
                                    alt="Keystone Logo"
                                />
                            </div>
                            <div className="walletOption">
                                Coinbase
                                <img
                                    src={coinbase}
                                    width={40}
                                    alt="Coinbase Logo"
                                />
                            </div>
                        </div>
                    </div>
                </StyledModalContent>
            </ReactModal>
        </div>
    )
}

const WalletModal = styled(UnstyledWalletModal)`
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

export default WalletModal
