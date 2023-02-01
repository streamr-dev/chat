import { ButtonHTMLAttributes } from 'react'
import tw from 'twin.macro'
import SecondaryButton from '../SecondaryButton'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    secondary?: boolean
}

export default function ActionTextButton({ secondary = false, ...props }: Props) {
    return (
        <SecondaryButton
            {...props}
            css={[tw`block font-medium h-10 px-5 text-[0.875rem]`, secondary && tw`bg-transparent`]}
        />
    )
}
