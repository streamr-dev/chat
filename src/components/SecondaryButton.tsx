import { ButtonHTMLAttributes, forwardRef, Ref } from 'react'
import tw from 'twin.macro'
import Button from './Button'

const SecondaryButton = forwardRef(
    (props: ButtonHTMLAttributes<HTMLButtonElement>, ref: Ref<HTMLButtonElement>) => {
        return (
            <Button
                {...props}
                ref={ref}
                css={[
                    tw`
                        text-[#59799C]
                        bg-[#EFF4F9]
                        h-[30px]
                        px-3
                        rounded-full
                    `,
                ]}
            />
        )
    }
)

export default SecondaryButton
