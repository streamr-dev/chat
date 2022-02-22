import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Button from './Button'
import { KARELIA, SEMIBOLD } from '../utils/css'
import WalletModal from './WalletModal'
import AddressButton from './AddressButton'
import { useStore } from './Store'
import useConnect from '../hooks/useConnect'
import ReactModal from 'react-modal'
import { useState } from 'react'
import ExternalLinkIcon from '../icons/ExternalLinkIcon'
import CopyIcon from '../icons/CopyIcon'
import useDisconnect from '../hooks/useDisconnect'

type Props = {
    className?: string
}

const ConnectButton = styled(Button)`
    color: #ff5924;
    font-size: 15px;
    padding: 0 30px;
`

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    content: {
        border: 'none',
        width: '528px',
        height: '260px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        borderRadius: '20px',
        transform: 'translate(-50%, -50%)',
        fontFamily: `${KARELIA}`,
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
    color: #59799c;
    font-size: 14px;
    font-weight: 400;
`

const ExternalLink = styled.a`
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    font-family: ${KARELIA};
    vertical-align: middle;
    color: #ff5924;
    cursor: pointer;

    svg {
        margin-right: 5px;
    }
`

const CloseButton = styled.button`
    background-color: transparent;
    border: none;
`

const StyledModalContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 40px;

    input {
        appearance: none;
        background: #dee6ee;
        border: 0;
        outline: 0;
        width: 100%;
        padding: 13px 16px;
        font-size: 18px;
        border-radius: 8px;
        color: #36404e;
        font-weight: 500;
        margin-bottom: 10px;
    }

    ${CreateButton} {
        float: right;
    }
`

const ModalHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const ContentHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const ChangeButton = styled.button`
    background-color: #eff4f9;
    border: none;
    font-family: ${KARELIA};
    color: #59799c;
    border-radius: 100px;
    font-size: 14px;
    padding: 0px 12px;
    height: 30px;
`

const LinkContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`

function trunc(address: string) {
    if (/^0x[a-f\d]{40}$/i.test(address)) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return address
}

const UnstyledNavbar = ({ className }: Props) => {
    const { account } = useStore()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [copiedText, setCopiedText] = useState(' Copy Address')

    const connect = useConnect()

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const openModal = () => {
        setModalIsOpen(true)
    }

    const handleClick = () => {
        setCopiedText(' Copied!')
        setTimeout(() => {
            setCopiedText(' Copy Address')
        }, 2000)
    }
    const disconnect = useDisconnect()

    return (
        <nav className={className}>
            <h4>
                <Link to="/">thechat.eth</Link>
            </h4>
            {account ? (
                <>
                    <AddressButton
                        type="button"
                        onClick={openModal}
                        address={account}
                    />
                    <ReactModal
                        appElement={
                            document.getElementById('root') as HTMLElement
                        }
                        isOpen={modalIsOpen}
                        contentLabel="Connect a wallet"
                        style={customStyles}
                    >
                        <StyledModalContent>
                            <ModalHeader>
                                <h2>Account</h2>
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
                            <ContentContainer>
                                <ContentHeader>
                                    <Subheading>
                                        Connected with Metamask
                                    </Subheading>
                                    <ChangeButton>Change</ChangeButton>
                                </ContentHeader>
                                <input
                                    disabled={true}
                                    placeholder={trunc(account)}
                                />
                                <LinkContainer>
                                    <ExternalLink
                                        href={`https://etherscan.io/address/${account}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLinkIcon /> View on explorer
                                    </ExternalLink>
                                    <ExternalLink
                                        onClick={() => {
                                            handleClick()
                                            navigator.clipboard.writeText(
                                                account
                                            )
                                        }}
                                    >
                                        <CopyIcon />
                                        {copiedText}
                                    </ExternalLink>
                                </LinkContainer>
                            </ContentContainer>
                        </StyledModalContent>
                    </ReactModal>
                </>
            ) : (
                <WalletModal />
            )}
        </nav>
    )
}

const Navbar = styled(UnstyledNavbar)`
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 24px;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 24px;
    position: absolute;
    top: 0px;
    width: 100%;

    h4 {
        flex-grow: 1;
        font-size: 22px;
        margin: 0px;
    }

    ${Button} {
        align-items: center;
        border-radius: 1.5rem;
        display: flex;
        font-family: ${KARELIA};
        font-weight: ${SEMIBOLD};

        :hover,
        :focus {
            background-color: #fefefe;
        }

        :active {
            background-color: #f7f7f7;
        }
    }

    ${Button} > span {
        display: block;
        transform: translateY(-0.1em);
    }
`

export default Navbar
