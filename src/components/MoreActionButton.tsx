import ActionButton, { ActionButtonProps } from '$/components/ActionButton'
import Spinner from '$/components/Spinner'
import MoreIcon from '$/icons/MoreIcon'
import { forwardRef, ReactNode, Ref } from 'react'
import tw from 'twin.macro'

type Props = ActionButtonProps & {
    deleting?: boolean
    icon?: ReactNode
}

const MoreActionButton = forwardRef(
    (
        { deleting = false, active = false, icon = <svg />, ...props }: Props,
        ref: Ref<HTMLButtonElement>
    ) => (
        <ActionButton {...props} active={deleting || active} ref={ref}>
            {deleting ? (
                <>
                    <Spinner r={20} strokeWidth={1} />
                    <div
                        css={[
                            tw`
                                flex
                                items-center
                                justify-center
                                w-10
                                h-10
                            `,
                        ]}
                    >
                        {icon}
                    </div>
                </>
            ) : (
                <MoreIcon />
            )}
        </ActionButton>
    )
)

export default MoreActionButton
