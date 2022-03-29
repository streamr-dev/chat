import React, { ReactElement, useState } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { KARELIA } from '../../utils/css'
import metamask from './icons/metamask.svg'
import keystone from './icons/keystone.svg'
import coinbase from './icons/coinbase.svg'
import walletconnect from './icons/walletconnect.svg'
import Button from '../Button'
import useConnect from '../../hooks/useConnect'

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    content: {
        border: 'none',
        width: window.innerWidth < 768 ? '90vw' : '512px',
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

const StyledModalContent = styled.div``

const WalletOptions = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    min-height: 100%;
`

const WalletOption = styled.div`
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

    :hover {
        background-color: #dfe3e8;
    }
`

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100%;
    height: 440px;
    padding: 0px 20px;
`

const ModalHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const ModalCloseButton = styled.button`
    background-color: transparent;
    border: none;
`

const UnstyledWalletModal = ({ button }: { button?: ReactElement }) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const connect = useConnect()

    const openModal = () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    return (
        <div>
            <ConnectButton
                type="button"
                onClick={() => {
                    openModal()
                }}
            >
                Connect a wallet
            </ConnectButton>
            <ReactModal
                isOpen={modalIsOpen}
                contentLabel="Connect a wallet"
                style={customStyles}
                onRequestClose={closeModal}
                appElement={document.getElementById('root') as HTMLElement}
            >
                <StyledModalContent>
                    <ModalContainer>
                        <ModalHeader>
                            <h2>Select a wallet</h2>
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
                            </ModalCloseButton>
                        </ModalHeader>
                        <WalletOptions>
                            <WalletOption
                                onClick={() => {
                                    connect()
                                    closeModal()
                                }}
                            >
                                Metamask
                                <img
                                    src={metamask}
                                    width={40}
                                    alt="Coinbase Logo"
                                />
                            </WalletOption>
                            <WalletOption>
                                WalletConnect
                                <img
                                    src={walletconnect}
                                    width={40}
                                    alt="WalletConnect Logo"
                                />
                            </WalletOption>
                            <WalletOption>
                                Keystone
                                <img
                                    src={keystone}
                                    width={40}
                                    alt="Keystone Logo"
                                />
                            </WalletOption>
                            <WalletOption>
                                Coinbase
                                <img
                                    src={coinbase}
                                    width={40}
                                    alt="Coinbase Logo"
                                />
                            </WalletOption>
                        </WalletOptions>
                    </ModalContainer>
                </StyledModalContent>
            </ReactModal>
        </div>
    )
}

const ConnectButton = styled(Button)`
    border-radius: 100px;
    color: #ff5924;
    font-family: ${KARELIA};
    font-size: 15px;
    height: 100%;
    padding: 10px 30px 13px;

    :hover,
    :focus {
        background-color: #fefefe;
    }

    :active {
        background-color: #f7f7f7;
    }
`

const WalletModal = styled(UnstyledWalletModal)``

export default WalletModal
