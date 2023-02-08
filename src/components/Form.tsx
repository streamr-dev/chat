import React, { FormEvent, FormHTMLAttributes } from 'react'
import tw from 'twin.macro'

type Props = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
    onSubmit?: () => void
}

export default function Form({ onSubmit: onSubmitProp, ...props }: Props) {
    function onSubmit(e: FormEvent) {
        e.preventDefault()

        if (typeof onSubmitProp === 'function') {
            onSubmitProp()
        }
    }

    return (
        <form
            {...props}
            onSubmit={onSubmit}
            css={[
                tw`
                    [* + & label:first-of-type]:mt-8
                    [* + label]:mt-8
                `,
            ]}
        />
    )
}
