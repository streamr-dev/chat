import { ButtonHTMLAttributes } from 'react'
import tw from 'twin.macro'
import SidebarButton from './SidebarButton'
import Text from './Text'

export enum SidebarUtilityButtonType {
    None,
    Search,
    Add,
}

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
    label?: string
    type?: SidebarUtilityButtonType
}

export default function SidebarUtilityButton({
    label = 'Button',
    type = SidebarUtilityButtonType.None,
    ...props
}: Props) {
    return (
        <SidebarButton
            {...props}
            icon={
                <div
                    css={tw`
                        w-full
                        h-full
                        flex
                        items-center
                        justify-center
                    `}
                >
                    <div
                        css={tw`
                            rounded-full
                            bg-white
                            h-9
                            w-9
                            flex
                            items-center
                            justify-center
                            text-[#59799C]
                        `}
                    >
                        {type === SidebarUtilityButtonType.Add && (
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8.44106 16.8683C8.5894 17.0167 8.7906 17.1 9.00039 17.1C9.21018 17.1 9.41138 17.0167 9.55972 16.8683C9.70807 16.72 9.79141 16.5188 9.79141 16.309V9.79104H16.3094C16.5192 9.79104 16.7204 9.7077 16.8687 9.55936C17.0171 9.41101 17.1004 9.20981 17.1004 9.00002C17.1004 8.79023 17.0171 8.58904 16.8687 8.44069C16.7204 8.29235 16.5192 8.20901 16.3094 8.20901H9.79141V1.69104C9.79141 1.48125 9.70807 1.28005 9.55972 1.13171C9.41138 0.983363 9.21018 0.900024 9.00039 0.900024C8.7906 0.900024 8.5894 0.983363 8.44106 1.13171C8.29271 1.28005 8.20937 1.48125 8.20937 1.69104V8.20901H1.69141C1.48162 8.20901 1.28042 8.29235 1.13207 8.44069C0.98373 8.58904 0.900391 8.79023 0.900391 9.00002C0.900391 9.20981 0.98373 9.41101 1.13207 9.55936C1.28042 9.7077 1.48162 9.79104 1.69141 9.79104H8.20937V16.309C8.20937 16.5188 8.29271 16.72 8.44106 16.8683Z"
                                    fill="currentColor"
                                />
                            </svg>
                        )}
                        {type === SidebarUtilityButtonType.Search && (
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6.5 2C4.01472 2 2 4.01472 2 6.5C2 8.98528 4.01472 11 6.5 11C8.98528 11 11 8.98528 11 6.5C11 4.01472 8.98528 2 6.5 2ZM0.5 6.5C0.5 3.18629 3.18629 0.5 6.5 0.5C9.81371 0.5 12.5 3.18629 12.5 6.5C12.5 7.88653 12.0297 9.16322 11.2399 10.1792L15.2803 14.2197C15.5732 14.5126 15.5732 14.9874 15.2803 15.2803C14.9874 15.5732 14.5126 15.5732 14.2197 15.2803L10.1792 11.2399C9.16322 12.0297 7.88653 12.5 6.5 12.5C3.18629 12.5 0.5 9.81371 0.5 6.5Z"
                                    fill="currentColor"
                                />
                            </svg>
                        )}
                    </div>
                </div>
            }
            css={tw`
                h-20
                lg:h-[92px]
            `}
        >
            <Text css={tw`text-[16px]`}>{label}</Text>
        </SidebarButton>
    )
}
