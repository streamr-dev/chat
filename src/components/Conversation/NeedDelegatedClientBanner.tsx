import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { DelegationAction } from '../../features/delegation'
import SecondaryButton from '../SecondaryButton'
import Text from '../Text'

export default function NeedDelegatedClientBanner() {
    const dispatch = useDispatch()

    return (
        <div
            css={[
                tw`
                    rounded-xl
                    items-center
                    flex
                    h-12
                    w-full
                `,
            ]}
        >
            <div
                css={[
                    tw`
                        text-[#59799C]
                        p-0
                        pl-5
                        text-[0.875rem]
                    `,
                ]}
            >
                <Text>Message publishing requires a delegated account.</Text>
            </div>
            <div
                css={[
                    tw`
                        ml-4
                    `,
                ]}
            >
                <SecondaryButton
                    onClick={() => void dispatch(DelegationAction.requestPrivateKey())}
                    css={[
                        tw`
                            text-[0.875rem]
                            h-8
                            px-4
                        `,
                    ]}
                >
                    <Text>Delegate now</Text>
                </SecondaryButton>
            </div>
        </div>
    )
}
