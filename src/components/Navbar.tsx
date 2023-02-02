import tw from 'twin.macro'
import Text from './Text'
import Button from './Button'

type Props = React.HTMLAttributes<HTMLElement>

export default function Navbar({ children, ...props }: Props) {
    return (
        <nav
            {...props}
            css={[
                tw`
                    absolute
                    box-border
                    flex
                    items-center
                    pb-6
                    pt-5
                    md:pt-8
                    px-4
                    md:px-10
                    top-0
                    w-full
                `,
            ]}
        >
            <div css={tw`grow`}>
                <h4
                    css={[
                        tw`
                            cursor-pointer
                            m-0
                            select-none
                            w-max
                        `,
                    ]}
                >
                    <div tw="relative">
                        <span
                            css={[
                                tw`
                                    font-medium
                                    text-[16px]
                                    md:text-[22px]
                                    tracking-widest
                                `,
                            ]}
                        >
                            thechat.eth
                        </span>
                        <div
                            css={[
                                tw`
                                    absolute
                                    bg-white
                                    inline-block
                                    px-2
                                    py-[2px]
                                    rounded-[10%]
                                    text-[12px]
                                    md:text-[14px]
                                    -top-5
                                    -right-8
                                `,
                            ]}
                        >
                            <Text>Beta</Text>
                            <div
                                css={[
                                    tw`
                                        bg-white
                                        h-2
                                        w-2
                                        absolute
                                        rotate-[-38deg]
                                        -bottom-1
                                        right-7
                                        rounded-[1px]
                                    `,
                                ]}
                            />
                        </div>
                    </div>
                </h4>
            </div>
            <div
                css={[
                    tw`
                        flex
                        items-center
                        [> * + *]:ml-4
                    `,
                ]}
            >
                {children}
            </div>
        </nav>
    )
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function NavButton({ children, ...props }: ButtonProps) {
    return (
        <Button
            {...props}
            css={[
                tw`
                    flex
                    font-karelia
                    font-medium
                    h-full
                    items-center
                    px-5
                    md:px-8
                    py-2.5
                    rounded-[1.5rem]
                    text-[14px]
                    md:text-[1rem]
                    tracking-wider
                    hover:bg-[#fefefe]
                    active:bg-[#f7f7f7]
                `,
            ]}
        >
            {children}
        </Button>
    )
}
