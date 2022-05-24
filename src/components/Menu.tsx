import {
    ButtonHTMLAttributes,
    HTMLAttributes,
    LinkHTMLAttributes,
    ReactNode,
    useEffect,
    useRef,
} from 'react'
import tw from 'twin.macro'
import Text from './Text'

export default function Menu(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            css={[
                tw`
                    bg-white
                    absolute
                    rounded-[10px]
                    shadow-[0px 0px 10px rgba(0, 0, 0, 0.1)]
                    w-[250px]
                    min-h-[1rem]
                    right-0
                    top-[100%]
                    mt-2
                    py-1
                    text-[0.875rem]
                    overflow-hidden
                `,
            ]}
        />
    )
}

type MenuContainerProps = HTMLAttributes<HTMLDivElement> & {
    onMouseDownOutside?: () => void
}

export function MenuContainer({
    onMouseDownOutside,
    ...props
}: MenuContainerProps) {
    const rootRef = useRef<HTMLDivElement>(null)

    const onMouseDownOutsideRef = useRef(onMouseDownOutside)

    useEffect(() => {
        onMouseDownOutsideRef.current = onMouseDownOutside
    }, [onMouseDownOutside])

    useEffect(() => {
        function handleClickOutside(e: any) {
            const { current: root } = rootRef

            if (!root || root.contains(e.target)) {
                return
            }

            if (typeof onMouseDownOutsideRef.current === 'function') {
                onMouseDownOutsideRef.current()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return <div {...props} tw="relative" ref={rootRef} />
}

type ClickableHTMLElementProps =
    | LinkHTMLAttributes<HTMLAnchorElement>
    | ButtonHTMLAttributes<HTMLButtonElement>

type MenuItemProps<T = ClickableHTMLElementProps> = T & {
    tag?: 'a' | 'button'
    icon?: ReactNode
}

function MenuItem({
    tag: Tag = 'button',
    icon,
    children,
    ...propsProp
}: MenuItemProps) {
    let props: unknown

    if (Tag === 'button') {
        props = propsProp as ButtonHTMLAttributes<HTMLButtonElement>
    }

    if (Tag === 'a') {
        props = propsProp as LinkHTMLAttributes<HTMLAnchorElement>
    }

    return (
        <Tag
            {...props}
            css={[
                tw`
                    bg-white
                    w-full
                    text-left
                    flex
                    items-center
                    h-9
                    !text-[#59799C]
                    hover:bg-[#EFF4F9]
                `,
            ]}
        >
            <div
                css={[
                    tw`
                        w-10
                        flex-shrink-0
                        flex
                        justify-center
                        [svg]:block
                    `,
                ]}
            >
                {icon}
            </div>
            <div>
                <Text>{children}</Text>
            </div>
        </Tag>
    )
}

export function MenuLinkItem(
    props: MenuItemProps<LinkHTMLAttributes<HTMLAnchorElement>>
) {
    return <MenuItem {...props} tag="a" />
}

export function MenuSeparatorItem(props: HTMLAttributes<HTMLHRElement>) {
    return (
        <hr
            {...props}
            css={[
                tw`
                    border-0
                    h-[1px]
                    bg-[#DEE6EE]
                    my-1
                `,
            ]}
        />
    )
}

export function MenuButtonItem({
    type = 'button',
    ...props
}: MenuItemProps<ButtonHTMLAttributes<HTMLButtonElement>>) {
    return <MenuItem {...props} tag="button" type={type} />
}
