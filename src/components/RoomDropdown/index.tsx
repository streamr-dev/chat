import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import {
    AddMemberIcon,
    CopyIcon,
    DeleteIcon,
    DownloadIcon,
    EditMembersIcon,
    SearchIcon,
} from '../../icons'
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
`

const RoomDropdown = ({ button }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
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
        setIsOpen((c) => !c)
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
                                <AddMemberIcon />
                            </td>
                            <td>Add member</td>
                        </ListItem>
                        <ListItem>
                            <td>
                                <EditMembersIcon />
                            </td>
                            <td>Edit members</td>
                        </ListItem>
                        <hr></hr>
                        <ListItem>
                            <td>
                                <SearchIcon />
                            </td>
                            <td>Search in conversation</td>
                        </ListItem>
                        <ListItem>
                            <td>
                                <DownloadIcon />
                            </td>
                            <td>Save to local</td>
                        </ListItem>
                        <ListItem>
                            <td>
                                <CopyIcon />
                            </td>
                            <td>Copy room id</td>
                        </ListItem>
                        <hr></hr>
                        <ListItem>
                            <td>
                                <DeleteIcon />
                            </td>
                            <td>Delete room</td>
                        </ListItem>
                    </DropDownList>
                </DropDownListContainer>
            )}
        </DropDownContainer>
    )
}

export default RoomDropdown
