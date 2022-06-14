import { InputHTMLAttributes } from 'react'
import tw from 'twin.macro'

export default function TextField(props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
    return (
        <input
            {...props}
            type="text"
            css={[
                tw`
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
