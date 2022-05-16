import tw from 'twin.macro'
import Text from './Text'
import Button from './Button'
// import styled from 'styled-components'
// import Button from './Button'
// import { KARELIA, SEMIBOLD } from '../utils/css'
// import WalletModal from './WalletModal'
// import AddressButton from './AddressButton'
// import { useStore } from './Store'
// import ReactModal from 'react-modal'
// import { useState } from 'react'
// import ExternalLinkIcon from '../icons/ExternalLinkIcon'
// import CopyIcon from '../icons/CopyIcon'

// const customStyles = {
//     overlay: {
//         backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     },
//     content: {
//         border: 'none',
//         width: '90vw',
//         maxWidth: '512px',
//         top: '50%',
//         left: '50%',
//         right: 'auto',
//         bottom: 'auto',
//         borderRadius: '20px',
//         transform: 'translate(-50%, -50%)',
//         fontFamily: `${KARELIA}`,
//     },
// }

// const CreateButton = styled.button`
//     align-items: center;
//     background: #ff5924;
//     border-radius: 100px;
//     border: none;
//     box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.1);
//     color: white;
//     display: inline-flex;
//     height: auto;
//     font-family: ${KARELIA};
//     font-size: 18px;
//     padding: 10px 30px;
//     :hover,
//     :focus {
//         background-color: #de4716;
//     }
//     div {
//         margin-right: 16px;
//         transform: translateY(-0.1em);
//     }
//     svg {
//         display: block;
//     }
// `

// const Subheading = styled.h3`
//     color: #59799c;
//     font-size: 14px;
//     font-weight: 400;
// `

// const ExternalLink = styled.a`
//     display: flex;
//     align-items: center;
//     font-weight: 400;
//     font-size: 14px;
//     font-family: ${KARELIA};
//     vertical-align: middle;
//     color: #ff5924;
//     cursor: pointer;

//     svg {
//         margin-right: 5px;
//     }
// `

// const CloseButton = styled.button`
//     background-color: transparent;
//     border: none;
// `

// const StyledModalContent = styled.div`
//     display: flex;
//     flex-direction: column;
//     padding: 0 40px;

//     input {
//         appearance: none;
//         background: #dee6ee;
//         border: 0;
//         outline: 0;
//         width: 100%;
//         padding: 13px 16px;
//         font-size: 18px;
//         border-radius: 8px;
//         color: #36404e;
//         font-weight: 500;
//         margin-bottom: 10px;
//     }

//     ${CreateButton} {
//         float: right;
//     }
// `

// const ModalHeader = styled.div`
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
// `

// const ContentContainer = styled.div`
//     display: flex;
//     flex-direction: column;
// `

// const ContentHeader = styled.div`
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
// `

// const ChangeButton = styled.button`
//     background-color: #eff4f9;
//     border: none;
//     font-family: ${KARELIA};
//     color: #59799c;
//     border-radius: 100px;
//     font-size: 14px;
//     padding: 0px 12px;
//     height: 30px;
// `

// const LinkContainer = styled.div`
//     display: flex;
//     flex-direction: row;
//     gap: 10px;
// `

// function trunc(address: string) {
//     if (/^0x[a-f\d]{40}$/i.test(address)) {
//         return `${address.slice(0, 6)}...${address.slice(-4)}`
//     }

//     return address
// }

type Props = React.HTMLAttributes<HTMLElement>

export default function Navbar({ children, ...props }: Props) {
    return (
        <nav
            {...props}
            css={[
                tw`
                    absolute
                    box-border
                    flex
                    items-center
                    pb-6
                    pt-10
                    md:pt-[35px]
                    px-5
                    md:px-10
                    top-0
                    w-full
                `,
            ]}
        >
            <div tw="flex-grow">
                <h4
                    css={[
                        tw`
                            cursor-pointer
                            m-0
                            select-none
                            w-max
                        `,
                    ]}
                >
                    <div tw="relative">
                        <span
                            css={[
                                tw`
                                    font-medium
                                    text-[20px]
                                    md:text-[22px]
                                    tracking-widest
                                `,
                            ]}
                        >
                            thechat.eth
                        </span>
                        <div
                            css={[
                                tw`
                                    absolute
                                    bg-[#ffffff]
                                    inline-block
                                    px-2
                                    py-[2px]
                                    rounded-[10%]
                                    text-[14px]
                                    -top-5
                                    -right-8
                                `,
                            ]}
                        >
                            <Text>Beta</Text>
                            <div
                                css={[
                                    tw`
                                        bg-[white]
                                        h-2
                                        w-2
                                        absolute
                                        rotate-[-38deg]
                                        -bottom-1
                                        right-7
                                        rounded-[1px]
                                    `,
                                ]}
                            />
                        </div>
                    </div>
                </h4>
            </div>
            {children}
        </nav>
    )
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function NavButton({ children, ...props }: ButtonProps) {
    return (
        <Button
            {...props}
            css={[
                tw`
                    flex
                    font-karelia
                    font-medium
                    text-[14px]
                    md:text-[1rem]
                    items-center
                    rounded-[1.5rem]
                    hover:bg-[#fefefe]
                    active:bg-[#f7f7f7]
                `,
            ]}
        >
            <Text>{children}</Text>
        </Button>
    )
}
