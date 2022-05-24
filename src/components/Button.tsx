import tw, { css } from 'twin.macro'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ type = 'button', ...props }: Props) {
    return (
        <button
            {...props}
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
