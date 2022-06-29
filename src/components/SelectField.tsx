import Select, { components, OptionProps, ValueContainerProps } from 'react-select'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'
import tw from 'twin.macro'
import CheckIcon from '$/icons/CheckIcon'

export function Option({ children, isSelected, isDisabled, ...props }: OptionProps) {
    return (
        <components.Option
            {...props}
            isSelected={isSelected}
            isDisabled={isDisabled}
            css={[
                tw`
                    bg-white
                    text-[#36404E]
                    py-3
                    px-4
                    hover:bg-[#EFF4F9]
                    transition-colors
                    duration-300
                    hover:duration-100
                `,
                isDisabled &&
                    tw`
                        hover:bg-white
                        text-[#59799C]
                    `,
            ]}
        >
            <div
                css={[
                    tw`
                        flex
                        items-center
                    `,
                ]}
            >
                <div
                    css={[
                        tw`
                            flex-grow
                        `,
                    ]}
                >
                    {children}
                </div>
                {!!isSelected && (
                    <div>
                        <CheckIcon />
                    </div>
                )}
            </div>
        </components.Option>
    )
}

function Menu(props: any) {
    return (
        <components.Menu
            {...props}
            css={[
                tw`
                    rounded-lg
                    border-0
                    shadow-lg
                    px-0
                    py-1
                    mt-2
                `,
            ]}
        />
    )
}

function Control(props: any) {
    return (
        <components.Control
            {...props}
            css={[
                tw`
                    h-14
                    bg-[#DEE6EE]
                    border-0
                    outline-none
                    rounded-lg
                    shadow-none
                `,
            ]}
        />
    )
}

function DropdownIndicator(props: any) {
    return (
        <components.DropdownIndicator
            {...props}
            css={[
                tw`
                    px-4
                `,
            ]}
        >
            <svg
                css={[
                    tw`
                        transition-all
                        duration-200
                    `,
                    !!props.selectProps.menuIsOpen &&
                        tw`
                            rotate-180
                            translate-y-[-1px]
                        `,
                ]}
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
}

function ValueContainer(props: ValueContainerProps) {
    return (
        <components.ValueContainer
            {...props}
            css={[
                tw`
                    p-0
                    font-medium
                `,
            ]}
        />
    )
}

export function SingleValue(props: any) {
    return <components.SingleValue {...props} />
}

function IndicatorSeparator() {
    return null
}

type Props = Omit<StateManagerProps, 'components'> & {
    optionComponent?: any
    singleValueComponent?: any
}

export default function SelectField({
    optionComponent = Option,
    singleValueComponent = SingleValue,
    ...props
}: Props) {
    return (
        <Select
            {...props}
            backspaceRemovesValue={false}
            components={{
                Option: optionComponent,
                Menu,
                Control,
                DropdownIndicator,
                IndicatorSeparator,
                ValueContainer,
                SingleValue: singleValueComponent,
            }}
            isClearable={false}
            isSearchable={false} // Magic words to make the Select Read Only
            menuPortalTarget={document.querySelector('body')}
            menuShouldBlockScroll={true}
        />
    )
}
