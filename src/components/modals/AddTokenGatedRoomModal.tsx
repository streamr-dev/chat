import Form from '$/components/Form'
import Label from '$/components/Label'
import Modal, { AbortReason, Props as ModalProps } from '$/components/modals/Modal'
import PrimaryButton from '$/components/PrimaryButton'
import SecondaryButton from '$/components/SecondaryButton'
import Spinner from '$/components/Spinner'
import Text from '$/components/Text'
import Avatar from '$/components/Avatar'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { TokenInfo } from '$/features/misc/types'
import useFilteredKnownTokens from '$/hooks/useFilteredKnownTokens'
import useFlag from '$/hooks/useFlag'
import { Address } from '$/types'
import isBlank from '$/utils/isBlank'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import trunc from '$/utils/trunc'
import isSameAddress from '$/utils/isSameAddress'
import { useWalletProvider } from '$/features/wallet/hooks'
import useTokenStandard from '$/hooks/useTokenStandard'
import { TokenStandard, TokenTypes } from '$/features/tokenGatedRooms/types'
import TextField from '$/components/TextField'

interface TokenParams {
    tokenAddress: Address
    standard: TokenStandard
    tokenCount?: number
    tokenId?: number
}

interface Props extends ModalProps {
    onProceed?: (params: TokenParams) => void
}

interface BasicTokenInfo {
    address: Address
}

type Info = BasicTokenInfo | TokenInfo

const defaultInfo = {
    address: '',
}

export default function AddTokenGatedRoomModal({
    title = 'Add new token gated room',
    onProceed,
    ...props
}: Props) {
    const [tokenInfo, setTokenInfo] = useState<Info>(defaultInfo)

    const previousTokenInfo = useRef<Info>(tokenInfo)

    const dispatch = useDispatch()

    const provider = useWalletProvider()

    const standard = useTokenStandard(tokenInfo.address)

    const { isCountable, hasIds } = standard
        ? TokenTypes[standard]
        : TokenTypes[TokenStandard.Unknown]

    const [tokenCount, setTokenCount] = useState('')

    const [tokenId, setTokenId] = useState('')

    useEffect(() => {
        setTokenCount('')
        setTokenId('')
    }, [tokenInfo.address])

    const params = {
        tokenId: Number.parseInt(tokenId),
        tokenCount: Number.parseFloat(tokenCount),
    }

    const allSet =
        !isBlank(tokenInfo.address) &&
        (!isCountable || params.tokenCount > 0) &&
        (!hasIds || params.tokenId >= 0)

    return (
        <Modal
            {...props}
            title={title}
            onBeforeAbort={(reason) => {
                if (reason === AbortReason.Backdrop) {
                    return tokenInfo.address === '' && tokenId === '' && tokenCount === ''
                }
            }}
        >
            <Label>Token contract address from Polygon chain</Label>
            {isBlank(tokenInfo.address) ? (
                <Search
                    info={previousTokenInfo.current}
                    onInfo={(info) => {
                        setTokenInfo(info)

                        if (!provider) {
                            return
                        }

                        dispatch(
                            MiscAction.fetchTokenStandard({
                                address: info.address,
                                provider,
                            })
                        )
                    }}
                />
            ) : (
                <Token
                    info={tokenInfo}
                    onChangeClick={() => {
                        previousTokenInfo.current = tokenInfo

                        setTokenInfo(defaultInfo)
                    }}
                />
            )}
            <Form
                onSubmit={() => {
                    if (!standard) {
                        return
                    }

                    const result: TokenParams = {
                        standard,
                        tokenAddress: tokenInfo.address,
                        tokenCount: Number.isNaN(params.tokenCount) ? undefined : params.tokenCount,
                        tokenId: Number.isNaN(params.tokenId) ? undefined : params.tokenId,
                    }

                    onProceed?.(result)
                }}
            >
                {!!isCountable && (
                    <>
                        <Label htmlFor="tokenCount">Minimum balance needed to join the room</Label>
                        <TextField
                            id="tokenCount"
                            type="number"
                            placeholder="e.g. 100"
                            value={tokenCount}
                            onChange={({ target }) => void setTokenCount(target.value)}
                        />
                    </>
                )}
                {!!hasIds && (
                    <>
                        <Label htmlFor="tokenId">Token ID</Label>
                        <TextField
                            id="tokenId"
                            value={tokenId}
                            onChange={({ target }) => void setTokenId(target.value)}
                        />
                    </>
                )}
                <PrimaryButton
                    disabled={!allSet}
                    type="submit"
                    css={[
                        tw`
                            w-full
                            h-12
                            rounded-[24px]
                            px-8
                            mt-10
                        `,
                    ]}
                >
                    <Text>Create</Text>
                </PrimaryButton>
            </Form>
        </Modal>
    )
}

interface TokenProps {
    info: Info
    onChangeClick?: () => void
}

function Token({ info, onChangeClick }: TokenProps) {
    const isFetchingTokenStandard = useFlag(Flag.isFetchingTokenStandard(info.address))

    const standard = useTokenStandard(info.address)

    const dispatch = useDispatch()

    const provider = useWalletProvider()

    return (
        <div
            css={[
                tw`
                    [img]:mr-3
                    border
                    border-[#F1F4F7]
                    flex
                    h-[64px]
                    items-center
                    px-4
                    rounded-lg
                    text-[#36404E]
                    text-[14px]
                `,
            ]}
        >
            {'symbol' in info ? (
                <>
                    <img
                        src={`https://polygonscan.com/token/images/${info.logo}`}
                        alt={info.symbol}
                        width="32"
                        height="32"
                    />
                    <div>
                        <div
                            css={[
                                tw`
                                    font-semibold
                                `,
                            ]}
                        >
                            <Text>{info.symbol}</Text>
                        </div>
                        <div
                            css={[
                                tw`
                                    text-[#59799C]
                                `,
                            ]}
                        >
                            <Text>{info.name}</Text>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <Avatar
                        seed={info.address.toLowerCase()}
                        css={[
                            tw`
                                w-8
                                h-8
                                mr-3
                            `,
                        ]}
                    />
                    <div>{trunc(info.address)}</div>
                </>
            )}
            {!!standard && (
                <>
                    {standard === TokenStandard.Unknown ? (
                        <button
                            type="button"
                            css={[
                                tw`
                                    bg-[#59799C]
                                    ml-6
                                    px-1
                                    rounded-sm
                                    select-none
                                    text-[10px]
                                    text-white
                                    appearance-none
                                `,
                            ]}
                            onClick={() => {
                                dispatch(
                                    MiscAction.setTokenStandard({
                                        address: info.address,
                                        standard: undefined,
                                    })
                                )

                                if (!provider) {
                                    return
                                }

                                dispatch(
                                    MiscAction.fetchTokenStandard({
                                        address: info.address,
                                        provider,
                                    })
                                )
                            }}
                        >
                            <Text>Unknown</Text>
                        </button>
                    ) : (
                        <div
                            css={[
                                tw`
                                    bg-[#59799C]
                                    ml-6
                                    px-1
                                    rounded-sm
                                    select-none
                                    text-[10px]
                                    text-white
                                `,
                            ]}
                        >
                            <Text>{standard}</Text>
                        </div>
                    )}
                </>
            )}
            <div
                css={[
                    tw`
                        flex-grow
                    `,
                ]}
            />
            {isFetchingTokenStandard ? (
                <div
                    css={[
                        tw`
                            relative
                            w-4
                        `,
                    ]}
                >
                    <Spinner strokeWidth={1} />
                </div>
            ) : (
                <div>
                    <SecondaryButton
                        onClick={onChangeClick}
                        css={[
                            tw`
                                text-[0.875rem]
                                h-8
                                px-4
                            `,
                        ]}
                    >
                        <Text>Change</Text>
                    </SecondaryButton>
                </div>
            )}
        </div>
    )
}

interface SearchProps {
    info?: Info
    onInfo?: (info: Info) => void
}

function Search({ info = defaultInfo, onInfo }: SearchProps) {
    const [value, setValue] = useState(info.address)

    useEffect(() => {
        setValue(info.address)
    }, [info.address])

    const inputRef = useRef<HTMLInputElement>(null)

    const dispatch = useDispatch()

    const knownTokens = useFilteredKnownTokens()

    const isFetchingKnownTokens = useFlag(Flag.isFetchingKnownTokens())

    const listRef = useRef<HTMLUListElement>(null)

    useEffect(() => {
        // `fetchKnownTokens` knows to run once per session. No need to optimize anything here.
        dispatch(MiscAction.fetchKnownTokens())
    }, [])

    useEffect(() => {
        dispatch(MiscAction.setKnownTokensFilter(value))
    }, [value])

    return (
        <div
            css={[
                tw`
                    border
                    border-[#F1F4F7]
                    rounded-lg
                `,
            ]}
        >
            <Form
                css={[
                    tw`
                        border-[#F1F4F7]
                        border-b
                        h-[56px]
                        flex
                        items-center
                    `,
                ]}
                onSubmit={() => {
                    if (!/0x[a-f\d]{40}/i.test(value)) {
                        return
                    }

                    const tokenInfo = knownTokens.find(({ address }) =>
                        isSameAddress(value, address)
                    )

                    onInfo?.(
                        tokenInfo || {
                            address: value,
                        }
                    )
                }}
            >
                <div
                    css={[
                        tw`
                            px-4
                        `,
                    ]}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6.5 2.237a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm-6 4.5a6 6 0 1 1 10.74 3.68l4.04 4.04a.75.75 0 1 1-1.06 1.06l-4.04-4.04A6 6 0 0 1 .5 6.737z"
                            fill="#59799C"
                        />
                    </svg>
                </div>
                <div
                    css={[
                        tw`
                            flex-grow
                        `,
                    ]}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        css={[
                            tw`
                                appearance-none
                                outline-none
                                text-[#36404E]
                                placeholder:text-[#59799C]
                                text-[14px]
                                w-full
                                translate-y-[-0.06em]
                            `,
                        ]}
                        placeholder="Search or enter token address…"
                        value={value}
                        autoFocus
                        onChange={({ target }) => void setValue(target.value)}
                        onKeyDown={(e) => {
                            if (!isBlank(value) && e.key === 'Escape') {
                                e.stopPropagation()

                                setValue('')
                            }

                            if (e.key === 'ArrowDown') {
                                const { current: list } = listRef

                                if (!list) {
                                    return
                                }

                                list.getElementsByTagName('button')?.item(0)?.focus()

                                e.preventDefault()
                            }
                        }}
                    />
                </div>
                {!isBlank(value) && (
                    <button
                        type="button"
                        css={[
                            tw`
                                appearance-none
                                px-4
                                h-full
                            `,
                        ]}
                        onClick={() => {
                            setValue('')

                            inputRef.current?.focus()
                        }}
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6 4.94L2.03.97A.75.75 0 0 0 .97 2.03L4.94 6 .97 9.97a.75.75 0 0 0 1.06 1.06L6 7.06l3.97 3.97a.75.75 0 0 0 1.06-1.06L7.06 6l3.97-3.97A.749.749 0 1 0 9.97.97L6 4.94z"
                                fill="#59799C"
                            />
                        </svg>
                    </button>
                )}
            </Form>
            <div
                css={[
                    tw`
                        flex
                        items-center
                        h-[326px]
                    `,
                ]}
            >
                {knownTokens.length ? (
                    <div
                        css={[
                            tw`
                                h-full
                                overflow-auto
                                w-full
                            `,
                        ]}
                    >
                        <ul
                            ref={listRef}
                            css={[
                                tw`
                                    text-[14px]
                                    py-1.5
                                `,
                            ]}
                        >
                            {knownTokens.map((t) => (
                                <li key={t.address}>
                                    <button
                                        type="button"
                                        onKeyDown={(e) => {
                                            if (e.key === 'ArrowUp') {
                                                const el =
                                                    e.currentTarget.parentElement?.previousElementSibling
                                                        ?.getElementsByTagName('button')
                                                        ?.item(0) || inputRef.current

                                                el?.focus()

                                                e.preventDefault()
                                            }

                                            if (e.key === 'ArrowDown') {
                                                const el =
                                                    e.currentTarget.parentElement?.nextElementSibling
                                                        ?.getElementsByTagName('button')
                                                        ?.item(0)

                                                el?.focus()

                                                e.preventDefault()
                                            }

                                            if (e.key === 'Escape') {
                                                inputRef.current?.focus()

                                                e.stopPropagation()
                                            }

                                            if (e.key === 'Backspace') {
                                                setValue('')

                                                inputRef.current?.focus()
                                            }
                                        }}
                                        css={[
                                            tw`
                                                appearance-none
                                                flex
                                                items-center
                                                px-4
                                                outline-none
                                                hover:bg-[#F1F4F7]
                                                focus:bg-[#F1F4F7]
                                                transition-colors
                                                w-full
                                                text-left
                                                h-[64px]
                                                text-[#36404E]

                                                [img]:mr-3
                                            `,
                                        ]}
                                        onClick={() => {
                                            onInfo?.(t)
                                        }}
                                    >
                                        <img
                                            src={`https://polygonscan.com/token/images/${t.logo}`}
                                            alt={t.symbol}
                                            width="32"
                                            height="32"
                                        />
                                        <div
                                            css={[
                                                tw`
                                                    flex-grow
                                                `,
                                            ]}
                                        >
                                            <div
                                                css={[
                                                    tw`
                                                        font-semibold
                                                    `,
                                                ]}
                                            >
                                                <Text>{t.symbol}</Text>
                                            </div>
                                            <div
                                                css={[
                                                    tw`
                                                        text-[#59799C]
                                                    `,
                                                ]}
                                            >
                                                <Text>{t.name}</Text>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div
                        css={[
                            tw`
                                text-[14px]
                                text-[#36404E]
                                text-center
                                w-full
                                p-4
                            `,
                        ]}
                    >
                        {isFetchingKnownTokens ? (
                            <>
                                <Spinner />
                                Loading tokens…
                            </>
                        ) : (
                            <>No tokens</>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
