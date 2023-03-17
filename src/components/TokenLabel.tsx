import { ComponentPropsWithRef, ElementType } from 'react'
import tw from 'twin.macro'

type OwnProps<T extends ElementType> = {
    as?: T
}

type Props<T extends ElementType> = OwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof OwnProps<T>>

export default function TokenLabel<T extends ElementType = 'label'>({ as, ...props }: Props<T>) {
    const Component = as || 'label'

    return (
        <Component
            {...props}
            css={tw`
                bg-[#59799C]
                px-1
                rounded-sm
                select-none
                text-[10px]
                text-white
                appearance-none
                tracking-wide
            `}
        />
    )
}
