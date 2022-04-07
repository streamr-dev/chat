import React from 'react'
import Select, { components } from 'react-select'
import styled from 'styled-components'
import publicIcon from './public.svg'
import viewOnlyIcon from './viewonly.svg'
import privateIcon from './private.svg'
import checkIcon from './check.svg'

const options = [
    {
        label: 'Private',
        subLabel: 'Only invited members can post and view messages',
        value: 'private',
        icon: privateIcon,
    },
    {
        label: 'View only',
        subLabel: 'Anyone can view other messages',
        value: 'viewonly',
        icon: viewOnlyIcon,
    },
    {
        label: 'Public',
        subLabel: 'Anyone can post and view other messages',
        value: 'public',
        icon: publicIcon,
    },
]

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        border: 'none',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#DEE6EE',
        height: '56px',
        borderRadius: '8px',
        alignItems: 'center',
        paddingLeft: '20px',
        paddingRight: '10px',
        marginBottom: '0',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    menu: (provided: any) => ({
        ...provided,
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        marginTop: '8px',
        zIndex: '100000',
        overflow: 'hidden',
    }),
    option: (provided: any) => ({
        ...provided,
        backgroundColor: 'white',
    }),
}

const OptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const LabelContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: auto;

    p {
        color: #36404e;
        font-size: 14px;
        margin: 0;
    }

    p + p {
        color: #59799c;
        font-size: 12px;
    }
`

const IconContainer = styled.div`
    border-radius: 50%;
    background-color: #f1f4f7;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
`

const CheckIcon = styled.img`
    width: 12px;
    height: 9px;
    margin-left: auto;
`

const ControlIcon = styled.div`
    color: #59799c;

    img {
        display: block;
    }
`

const OptionBody = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`

const Option = ({ data: { icon, label, subLabel }, ...props }: any) => (
    <components.Option {...props}>
        <OptionContainer>
            <IconContainer>
                <img src={icon} alt="" />
            </IconContainer>
            <OptionBody>
                <LabelContainer>
                    <p>{label}</p>
                    <p>{subLabel}</p>
                </LabelContainer>
                {props.isSelected && <CheckIcon src={checkIcon} />}
            </OptionBody>
        </OptionContainer>
    </components.Option>
)

function Control({ children, ...props }: any) {
    const {
        selectProps: { value },
    } = props

    const { icon } = value || {}

    return (
        <components.Control {...props}>
            <ControlIcon>{!!icon && <img src={icon} alt="" />}</ControlIcon>
            {children}
        </components.Control>
    )
}

const DropdownIndicator = (props: any) => (
    <components.DropdownIndicator {...props}>
        <svg
            width="10"
            height="7"
            viewBox="0 0 10 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4.65726 6.15367C4.69549 6.20919 4.74663 6.25458 4.8063 6.28594C4.86596 6.3173 4.93236 6.33368 4.99976 6.33368C5.06716 6.33368 5.13356 6.3173 5.19322 6.28594C5.25289 6.25458 5.30404 6.20919 5.34226 6.15367L9.09226 0.737002C9.13567 0.674526 9.16112 0.601349 9.16586 0.525421C9.1706 0.449494 9.15443 0.37372 9.11913 0.306333C9.08383 0.238946 9.03073 0.182522 8.96561 0.143193C8.90049 0.103864 8.82584 0.0831326 8.74976 0.0832525H1.24976C1.17386 0.083566 1.09948 0.104564 1.03463 0.143987C0.96977 0.18341 0.916886 0.239768 0.881664 0.307C0.846441 0.374231 0.830212 0.449792 0.834722 0.525557C0.839232 0.601322 0.86431 0.674424 0.90726 0.737002L4.65726 6.15367Z"
                fill="#59799C"
            />
        </svg>
    </components.DropdownIndicator>
)

export default function PrivacySelect({ onChange, value, ...props }: any) {
    return (
        <Select
            {...props}
            backspaceRemovesValue={false}
            components={{ Control, DropdownIndicator, Option }}
            getOptionLabel={(option: any) => option.label}
            isClearable={false}
            isSearchable={false} // Magic words to make the Select Read Only
            menuPortalTarget={document.querySelector('body')}
            menuShouldBlockScroll={true}
            onChange={onChange}
            options={options}
            styles={customStyles}
            value={value}
        />
    )
}
