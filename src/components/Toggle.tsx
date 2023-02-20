import tw, { css } from 'twin.macro'
import Spinner from './Spinner'

interface Props {
    value?: undefined | boolean
    onClick?: () => void
    busy?: boolean
}

export default function Toggle({ value: value, busy = false, onClick }: Props) {
    const undetermined = typeof value === 'undefined'

    return (
        <button
            type="button"
            onClick={onClick}
            css={[
                tw`
                    appearance-none
                    cursor-pointer
                    bg-[#59799C]
                    h-5
                    p-[2px]
                    w-10
                    rounded-full
                    transition-colors
                `,
                value && tw`bg-[#00875A]`,
            ]}
        >
            <div css={tw`relative`}>
                <div
                    css={[
                        ((value && !undetermined) || (!value && undetermined)) &&
                            css`
                                transition: 200ms ease-in margin-left, 200ms ease-out margin-right;
                            `,
                        ((!value && !undetermined) || (value && undetermined)) &&
                            css`
                                transition: 200ms ease-out margin-left, 200ms ease-in margin-right;
                            `,
                        tw`
                            h-4
                            opacity-90
                            rounded-full
                            bg-[white]
                            ml-0
                            mr-5
                        `,
                        value &&
                            tw`
                                ml-5
                                mr-0
                            `,
                        undetermined &&
                            tw`
                                ml-2.5
                                mr-2.5
                            `,
                    ]}
                />
                <div
                    css={[
                        value &&
                            css`
                                transition: 200ms ease-out margin-left;
                            `,
                        !value &&
                            css`
                                transition: 200ms ease-out margin-left;
                            `,
                        tw`
                            bg-white
                            h-4
                            w-4
                            absolute
                            top-0
                            rounded-full
                            ml-0
                        `,
                        value && tw`ml-5`,
                        undetermined && tw`ml-2.5`,
                    ]}
                >
                    {busy && <Spinner r={4} />}
                </div>
            </div>
        </button>
    )
}
