import { ButtonHTMLAttributes } from 'react'
import tw from 'twin.macro'
import Button from './Button'

export default function SecondaryButton(
    props: ButtonHTMLAttributes<HTMLButtonElement>
) {
    return (
        <Button
            {...props}
            css={[
                tw`
                    text-[#59799C]
                    bg-[#EFF4F9]
                    h-[30px]
                    px-3
                    rounded-[15px]
                `,
            ]}
        />
    )
}
