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
} from '../../../../icons'
import { KARELIA } from '../../../../utils/css'

type Props = {
    button?: React.ReactElement
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
const DropDownList = styled.div`
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
const ListItem = styled.button`
    appearance: none;
    cursor: pointer;
    border: none;
    font-family: ${KARELIA};
    color: #59799c;
    background-color: white;
    width: 100%;
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

const RoomDropdown = ({ button }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: any) {
            setIsOpen(false)
        }

        // Bind the event listener
        document.addEventListener('mouseup', handleClickOutside)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mouseup', handleClickOutside)
        }
    })

    const toggleOpen = () => {
        setIsOpen((c) => !c)
    }

    return (
        <DropDownContainer>
            {React.cloneElement(button!, { onClick: toggleOpen }) || (
                <DropDownHeader onClick={toggleOpen}>Mangoes</DropDownHeader>
            )}
            {isOpen && (
                <DropDownListContainer ref={ref}>
                    <DropDownList>
                        <ListItem>
                            <AddMemberIcon />
                            Add member
                        </ListItem>
                        <ListItem>
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
    )
}

export default RoomDropdown
