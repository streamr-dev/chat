import { ButtonHTMLAttributes, forwardRef, Ref } from 'react'
import tw, { css } from 'twin.macro'

const Button = forwardRef(
    (
        { type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>,
        ref: Ref<HTMLButtonElement>
    ) => {
        return (
            <button
                {...props}
                ref={ref}
                css={[
                    css`
                        will-change: transform;
                    `,
                    tw`
                        appearance-none
                        bg-[#ffffff]
                        border-0
                        h-12
                        text-[#323232]
                        transition-all
                        duration-300
                        select-none
                        hover:translate-y-[-2%]
                        active:duration-[50ms]
                        active:translate-y-[1%]
                        disabled:opacity-50
                        disabled:cursor-default
                    `,
                ]}
                type={type}
            />
        )
    }
)

export default Button
