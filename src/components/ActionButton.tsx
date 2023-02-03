import { ButtonHTMLAttributes, forwardRef, Ref } from 'react'
import tw from 'twin.macro'
import SecondaryButton from './SecondaryButton'

export type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean
    light?: boolean
}

const ActionButton = forwardRef(
    (
        { active = false, light = false, ...props }: ActionButtonProps,
        ref: Ref<HTMLButtonElement>
    ) => {
        return (
            <SecondaryButton
                {...props}
                ref={ref}
                css={[
                    tw`
                        bg-[#F7F9FC]
                        block
                        p-0
                        w-10
                        h-10
                        hover:bg-[#E0E7F2]
                        [svg]:mx-auto
                    `,
                    active &&
                        tw`
                            bg-[#E0E7F2]
                        `,
                    light &&
                        tw`
                            bg-white
                            hover:bg-[#F7F9FC]
                        `,
                    light &&
                        active &&
                        tw`
                            bg-[#F7F9FC]
                        `,
                ]}
            />
        )
    }
)

export default ActionButton
