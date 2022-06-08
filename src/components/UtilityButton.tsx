import { ButtonHTMLAttributes } from 'react'
import tw from 'twin.macro'
import Button from './Button'

export default function UtilityButton(
    props: ButtonHTMLAttributes<HTMLButtonElement>
) {
    return (
        <Button
            {...props}
            css={[
                tw`
                    bg-[#FFF2EE]
                    text-[#FF5924]
                    h-14
                    px-8
                    rounded-full
                    font-medium
                `,
            ]}
        />
    )
}
