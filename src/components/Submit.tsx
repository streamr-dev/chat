import { ButtonHTMLAttributes } from 'react'
import tw from 'twin.macro'
import PrimaryButton from './PrimaryButton'
import Text from './Text'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    label?: string
}

export default function Submit({
    label = 'Submit',
    disabled = false,
    type = 'submit',
    ...props
}: Props) {
    return (
        <div
            css={tw`
                flex
                mt-8
                md:mt-12
            `}
        >
            <div css={tw`grow`} />
            <div>
                <PrimaryButton
                    {...props}
                    type={type}
                    css={tw`
                        h-12
                        rounded-[24px]
                        px-8
                    `}
                    disabled={disabled}
                >
                    <Text>{label}</Text>
                </PrimaryButton>
            </div>
        </div>
    )
}
