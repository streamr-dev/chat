import tw from 'twin.macro'

export default function Text(props: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            {...props}
            css={[
                tw`
                    block
                    translate-y-[-0.06em]
                `,
            ]}
        />
    )
}
