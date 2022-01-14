import styled from 'styled-components'
import Button from '../Button'
import UserIcon from './user.svg'

type Props = {
    address: string,
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

function trunc(address: string) {
    if (/^0x[a-f\d]{40}$/i.test(address)) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return address
}

const UnstyledAddressButton = ({ address, ...props }: Props) => (
    <Button {...props}>
        <img src={UserIcon} alt="" />
        <span>{trunc(address)}</span>
    </Button>
)

const AddressButton = styled(UnstyledAddressButton)`
    background: rgba(255, 255, 255, 0.3);
    color: #000000;
    display: flex;
    font-size: 1rem;
    letter-spacing: 0.05em;
    padding: 0 30px 0 1.5rem;

    img {
        flex: 0;
        margin-right: 1rem;
    }
`

export default AddressButton
