import tw from 'twin.macro'
import PrimaryButton from './PrimaryButton'
import Text from './Text'

type Props = {
    label?: string
    disabled?: boolean
}

export default function Submit({ label = 'Submit', disabled = false }: Props) {
    return (
        <div
            css={[
                tw`
                    flex
                    mt-12
                `,
            ]}
        >
            <div
                css={[
                    tw`
                        flex-grow
                    `,
                ]}
            />
            <div>
                <PrimaryButton
                    type="submit"
                    css={[
                        tw`
                            h-12
                            rounded-[24px]
                            px-8
                        `,
                    ]}
                    disabled={disabled}
                >
                    <Text>{label}</Text>
                </PrimaryButton>
            </div>
        </div>
    )
}
