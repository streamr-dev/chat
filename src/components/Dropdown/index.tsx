import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { KARELIA } from '../../utils/css'

type Props = {
    button?: any
}

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
const DropDownList = styled.table`
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
const ListItem = styled.tr`
    padding: 10px 15px;
    background-clip: padding-box;
    display: flex;
    td {
        line-height: 13px;
        &:last-child {
            margin-left: 15px;
        }
    }
    &:first-child {
        padding-top: 15px;
        border-radius: 10px 10px 0 0;
    }
    &:last-child {
        padding-bottom: 15px;
        border-radius: 0 0 10px 10px;
    }
    :hover {
        background-color: #f1f4f7;
    }
`

const Dropdown = ({ button }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
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

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <DropDownContainer>
            {React.cloneElement(button, { onClick: toggleOpen }) || (
                <DropDownHeader onClick={toggleOpen}>Mangoes</DropDownHeader>
            )}
            {isOpen && (
                <DropDownListContainer ref={ref}>
                    <DropDownList>
                        <ListItem>
                            <td>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.5 2C4.84315 2 3.5 3.34315 3.5 5C3.5 6.65685 4.84315 8 6.5 8C8.15685 8 9.5 6.65685 9.5 5C9.5 3.34315 8.15685 2 6.5 2ZM2 5C2 2.51472 4.01472 0.5 6.5 0.5C8.98528 0.5 11 2.51472 11 5C11 7.48528 8.98528 9.5 6.5 9.5C4.01472 9.5 2 7.48528 2 5ZM13.25 7.25C13.6642 7.25 14 7.58579 14 8V8.75H14.75C15.1642 8.75 15.5 9.08579 15.5 9.5C15.5 9.91421 15.1642 10.25 14.75 10.25H14V11C14 11.4142 13.6642 11.75 13.25 11.75C12.8358 11.75 12.5 11.4142 12.5 11V10.25H11.75C11.3358 10.25 11 9.91421 11 9.5C11 9.08579 11.3358 8.75 11.75 8.75H12.5V8C12.5 7.58579 12.8358 7.25 13.25 7.25ZM3.875 12.5C2.93041 12.5 2 13.4102 2 14.75C2 15.1642 1.66421 15.5 1.25 15.5C0.835786 15.5 0.5 15.1642 0.5 14.75C0.5 12.7761 1.9201 11 3.875 11H9.125C11.0799 11 12.5 12.7761 12.5 14.75C12.5 15.1642 12.1642 15.5 11.75 15.5C11.3358 15.5 11 15.1642 11 14.75C11 13.4102 10.0696 12.5 9.125 12.5H3.875Z"
                                        fill="#59799C"
                                    />
                                </svg>
                            </td>
                            <td>Add member</td>
                        </ListItem>
                        <ListItem>
                            <td>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.5 2C4.84315 2 3.5 3.34315 3.5 5C3.5 6.65685 4.84315 8 6.5 8C8.15685 8 9.5 6.65685 9.5 5C9.5 3.34315 8.15685 2 6.5 2ZM2 5C2 2.51472 4.01472 0.5 6.5 0.5C8.98528 0.5 11 2.51472 11 5C11 7.48528 8.98528 9.5 6.5 9.5C4.01472 9.5 2 7.48528 2 5ZM11.6213 1.81802C11.9142 1.52513 12.3891 1.52513 12.682 1.81802C14.4393 3.57538 14.4393 6.42462 12.682 8.18198C12.3891 8.47487 11.9142 8.47487 11.6213 8.18198C11.3284 7.88909 11.3284 7.41421 11.6213 7.12132C12.7929 5.94975 12.7929 4.05025 11.6213 2.87868C11.3284 2.58579 11.3284 2.11091 11.6213 1.81802ZM12.1474 11.5681C12.2479 11.1663 12.6551 10.9219 13.0569 11.0224C14.0528 11.2714 14.6832 11.9082 15.0458 12.6333C15.3967 13.335 15.5 14.1178 15.5 14.75C15.5 15.1642 15.1642 15.5 14.75 15.5C14.3358 15.5 14 15.1642 14 14.75C14 14.2572 13.9158 13.7275 13.7042 13.3042C13.5043 12.9043 13.1972 12.6036 12.6931 12.4776C12.2913 12.3771 12.0469 11.9699 12.1474 11.5681ZM3.875 12.5C2.93041 12.5 2 13.4102 2 14.75C2 15.1642 1.66421 15.5 1.25 15.5C0.835786 15.5 0.5 15.1642 0.5 14.75C0.5 12.7761 1.9201 11 3.875 11H9.125C11.0799 11 12.5 12.7761 12.5 14.75C12.5 15.1642 12.1642 15.5 11.75 15.5C11.3358 15.5 11 15.1642 11 14.75C11 13.4102 10.0696 12.5 9.125 12.5H3.875Z"
                                        fill="#59799C"
                                    />
                                </svg>
                            </td>
                            <td>Edit members</td>
                        </ListItem>
                        <hr></hr>
                        <ListItem>
                            <td>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.5 2C4.01472 2 2 4.01472 2 6.5C2 8.98528 4.01472 11 6.5 11C8.98528 11 11 8.98528 11 6.5C11 4.01472 8.98528 2 6.5 2ZM0.5 6.5C0.5 3.18629 3.18629 0.5 6.5 0.5C9.81371 0.5 12.5 3.18629 12.5 6.5C12.5 7.88653 12.0297 9.16322 11.2399 10.1792L15.2803 14.2197C15.5732 14.5126 15.5732 14.9874 15.2803 15.2803C14.9874 15.5732 14.5126 15.5732 14.2197 15.2803L10.1792 11.2399C9.16322 12.0297 7.88653 12.5 6.5 12.5C3.18629 12.5 0.5 9.81371 0.5 6.5Z"
                                        fill="#59799C"
                                    />
                                </svg>
                            </td>
                            <td>Search in conversation</td>
                        </ListItem>
                        <ListItem>
                            <td>
                                <svg
                                    width="16"
                                    height="12"
                                    viewBox="0 0 16 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0.5 1.5C0.5 0.671574 1.17157 0 2 0H5.75C5.94891 0 6.13968 0.0790176 6.28033 0.21967L7.56066 1.5H14C14.8284 1.5 15.5 2.17157 15.5 3V10.5C15.5 11.3284 14.8284 12 14 12H2C1.17157 12 0.5 11.3284 0.5 10.5V1.5ZM5.43934 1.5L2 1.5V10.5H14V3H7.25C7.05109 3 6.86032 2.92098 6.71967 2.78033L5.43934 1.5ZM8 4.125C8.41421 4.125 8.75 4.46079 8.75 4.875V6.81434L8.96967 6.59467C9.26256 6.30178 9.73744 6.30178 10.0303 6.59467C10.3232 6.88756 10.3232 7.36244 10.0303 7.65533L8.53033 9.15533C8.23744 9.44822 7.76256 9.44822 7.46967 9.15533L5.96967 7.65533C5.67678 7.36244 5.67678 6.88756 5.96967 6.59467C6.26256 6.30178 6.73744 6.30178 7.03033 6.59467L7.25 6.81434V4.875C7.25 4.46079 7.58579 4.125 8 4.125Z"
                                        fill="#59799C"
                                    />
                                </svg>
                            </td>
                            <td>Save to local</td>
                        </ListItem>
                        <ListItem>
                            <td>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H9.5C10.3284 0.5 11 1.17157 11 2V5H14C14.8284 5 15.5 5.67157 15.5 6.5V14C15.5 14.8284 14.8284 15.5 14 15.5H6.5C5.67157 15.5 5 14.8284 5 14V11H2C1.17157 11 0.5 10.3284 0.5 9.5V2ZM6.5 11V14H14V6.5H11V9.5C11 10.3284 10.3284 11 9.5 11H6.5ZM9.5 9.5V2L2 2V9.5H9.5Z"
                                        fill="#59799C"
                                    />
                                </svg>
                            </td>
                            <td>Copy room id</td>
                        </ListItem>
                        <hr></hr>
                        <ListItem>
                            <td>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4.25 2C4.25 1.17157 4.92157 0.5 5.75 0.5H10.25C11.0784 0.5 11.75 1.17157 11.75 2V3.5H13.2423C13.2469 3.49996 13.2515 3.49996 13.2562 3.5H14.75C15.1642 3.5 15.5 3.83579 15.5 4.25C15.5 4.66421 15.1642 5 14.75 5H13.9483L13.2978 14.1069C13.2418 14.8918 12.5886 15.5 11.8017 15.5H4.19834C3.41138 15.5 2.75822 14.8918 2.70215 14.1069L2.05166 5H1.25C0.835786 5 0.5 4.66421 0.5 4.25C0.5 3.83579 0.835786 3.5 1.25 3.5H2.74381C2.74846 3.49996 2.75311 3.49996 2.75774 3.5H4.25V2ZM5.75 3.5H10.25V2H5.75V3.5ZM3.55548 5L4.19834 14H11.8017L12.4445 5H3.55548Z"
                                        fill="#59799C"
                                    />
                                </svg>
                            </td>
                            <td>Delete room</td>
                        </ListItem>
                    </DropDownList>
                </DropDownListContainer>
            )}
        </DropDownContainer>
    )
}

export default Dropdown
