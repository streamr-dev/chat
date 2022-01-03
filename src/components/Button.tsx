import styled from 'styled-components'

const Button = styled.button`
    appearance: none;
    background: #ffffff;
    border: 0;
    color: #323232;
    transition: all 0.3s ease-in-out;

    :hover,
    :focus {
        transform: translateY(5%);
    }

    :active {
        transform: translateY(15%);
    }
`

export default Button
