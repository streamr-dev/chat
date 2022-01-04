import styled from 'styled-components'
import { ActionType, useDispatch } from './ChatStore'
import { v4 as uuidv4 } from 'uuid'
import type { Props } from './SidebarItem'
import SidebarItem from './SidebarItem'

function UnstyledAddRoomItem(props: Props) {
    const dispatch = useDispatch()

    return (
        <SidebarItem
            {...props}
            onClick={() => {
                const id = uuidv4()

                dispatch({
                    type: ActionType.AddRooms,
                    payload: [{
                        id,
                        name: '',
                        readAt: Date.now(),
                    }],
                })

                dispatch({
                    type: ActionType.SelectRoom,
                    payload: id,
                })
            }}
            icon={(
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.2544 21.4911C10.4522 21.6889 10.7205 21.8 11.0002 21.8C11.2799 21.8 11.5482 21.6889 11.746 21.4911C11.9438 21.2933 12.0549 21.025 12.0549 20.7453V12.0547H20.7455C21.0252 12.0547 21.2935 11.9436 21.4913 11.7458C21.6891 11.548 21.8002 11.2797 21.8002 11C21.8002 10.7203 21.6891 10.452 21.4913 10.2542C21.2935 10.0564 21.0252 9.94532 20.7455 9.94532H12.0549V1.2547C12.0549 0.974979 11.9438 0.706715 11.746 0.508923C11.5482 0.311131 11.2799 0.200012 11.0002 0.200012C10.7205 0.200012 10.4522 0.311131 10.2544 0.508923C10.0566 0.706715 9.94551 0.974979 9.94551 1.2547V9.94532H1.25488C0.975162 9.94532 0.706898 10.0564 0.509106 10.2542C0.311314 10.452 0.200195 10.7203 0.200195 11C0.200195 11.2797 0.311314 11.548 0.509106 11.7458C0.706898 11.9436 0.975162 12.0547 1.25488 12.0547H9.94551V20.7453C9.94551 21.025 10.0566 21.2933 10.2544 21.4911Z"
                        fill="black"
                    />
                </svg>
            )}
        >
            Add new room
        </SidebarItem>
    )
}

const AddRoomItem = styled(UnstyledAddRoomItem)`
    font-size: 1.125rem;

    svg {
        display: block;
    }
`

export default AddRoomItem
