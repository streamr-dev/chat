import { InputHTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'

export default function TextField({
    type = 'text',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type={type}
            css={[
                css`
                    &[type='number']::-webkit-inner-spin-button,
                    &[type='number']::-webkit-outer-spin-button {
                        appearance: none;
                        margin: 0;
                    }
                `,
                tw`
                    appearance-none
                    bg-[#DEE6EE]
                    placeholder:text-[#59799C]
                    outline-none
                    h-14
                    rounded-lg
                    w-full
                    px-4
                `,
            ]}
        />
    )
}
