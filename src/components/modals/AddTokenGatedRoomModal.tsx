import Form from '$/components/Form'
import Label from '$/components/Label'
import Modal, { AbortReason, Props as ModalProps } from '$/components/modals/Modal'
import PrimaryButton from '$/components/PrimaryButton'
import SecondaryButton from '$/components/SecondaryButton'
import Spinner from '$/components/Spinner'
import Text from '$/components/Text'
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
import useTokenStandard from '$/hooks/useTokenStandard'
import { TokenStandard, TokenTypes } from '$/features/tokenGatedRooms/types'
import TextField from '$/components/TextField'
import Hint from '$/components/Hint'
import Toggle from '$/components/Toggle'
import { BigNumber } from 'ethers'
import uniq from 'lodash/uniq'
import useTokenMetadata from '$/hooks/useTokenMetadata'
import { parseUnits } from '@ethersproject/units'
import i18n from '$/utils/i18n'
import TokenStandardLabel from '$/components/TokenStandardLabel'
import TokenLogo from '$/components/TokenLogo'

interface Gate {
    tokenAddress: Address
    standard: TokenStandard
    minRequiredBalance?: string
    tokenIds: string[]
    stakingEnabled: boolean
}

interface Props extends ModalProps {
    onProceed?: (gate: Gate) => void
}

interface BasicTokenInfo {
    address: Address
}

type Info = BasicTokenInfo | TokenInfo

const defaultInfo = {
    address: '',
}

const defaultTransientParams = {
    minRequiredBalance: '',
    tokenIds: '',
    stakingEnabled: false,
}

export default function AddTokenGatedRoomModal({
    title = i18n('addTokenGatedRoomModal.title'),
    onProceed,
    ...props
}: Props) {
    const [tokenInfo, setTokenInfo] = useState<Info>(defaultInfo)

    const previousTokenInfo = useRef<Info>(tokenInfo)

    const dispatch = useDispatch()

    const standard = useTokenStandard(tokenInfo.address)

    const tokenMetadata = useTokenMetadata(tokenInfo.address, [])

    const { isCountable, hasIds } = standard
        ? TokenTypes[standard]
        : TokenTypes[TokenStandard.Unknown]

    const [{ minRequiredBalance, tokenIds, stakingEnabled }, setTransientParams] =
        useState(defaultTransientParams)

    useEffect(() => {
        setTransientParams(defaultTransientParams)
    }, [tokenInfo.address])

    const params = {
        minRequiredBalance: ((mrb: string) => {
            try {
                if (tokenMetadata && 'decimals' in tokenMetadata) {
                    return parseUnits(mrb, tokenMetadata.decimals || 1).toString()
                }
            } catch (e) {
                // Do nothing.
            }

            return mrb
        })(minRequiredBalance.trim()),
        tokenIds: uniq(
            tokenIds
                .replace(/\s*,+\s*/g, ',')
                .split(',')
                .filter(Boolean)
        ),
        stakingEnabled,
    }

    const allSet = (function () {
        try {
            if (isBlank(tokenInfo.address)) {
                throw new Error('Missing token address')
            }

            if (typeof tokenMetadata === 'undefined') {
                throw new Error('Missing token metadata')
            }

            if (isCountable) {
                if (BigNumber.from(params.minRequiredBalance).lte(0)) {
                    throw new Error('Non-positive minRequiredBalance')
                }
            }

            if (hasIds) {
                if (!params.tokenIds.length) {
                    throw new Error('No token ids')
                }

                for (let i = 0; i < params.tokenIds.length; i++) {
                    if (BigNumber.from(params.tokenIds[i]).lt(0)) {
                        throw new Error('Negative token id')
                    }
                }
            }
        } catch (e) {
            return false
        }

        return true
    })()

    return (
        <Modal
            {...props}
            title={title}
            onBeforeAbort={(reason) => {
                if (reason === AbortReason.Backdrop) {
                    return tokenInfo.address === '' && tokenIds === '' && minRequiredBalance === ''
                }
            }}
        >
            <Label>{i18n('addTokenGatedRoomModal.addressFieldLabel')}</Label>
            {isBlank(tokenInfo.address) ? (
                <Search
                    info={previousTokenInfo.current}
                    onInfo={(info) => {
                        setTokenInfo(info)

                        dispatch(
                            MiscAction.fetchTokenStandard({
                                address: info.address,
                                showLoadingToast: true,
                                fingerprint: Flag.isFetchingTokenStandard(info.address),
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
                    if (!standard || !allSet) {
                        return
                    }

                    const result: Gate = {
                        standard,
                        tokenAddress: tokenInfo.address,
                        ...params,
                    }

                    onProceed?.(result)
                }}
            >
                {!!isCountable && (
                    <>
                        <Label htmlFor="minRequiredBalance">
                            {i18n('addTokenGatedRoomModal.minBalanceFieldLabel')}
                        </Label>
                        <TextField
                            id="minRequiredBalance"
                            placeholder={i18n('addTokenGatedRoomModal.minBalanceFieldPlaceholder')}
                            value={minRequiredBalance}
                            onChange={({ target }) =>
                                void setTransientParams((t) => ({
                                    ...t,
                                    minRequiredBalance: target.value,
                                }))
                            }
                        />
                    </>
                )}
                {!!hasIds && (
                    <>
                        <Label htmlFor="tokenIds">
                            {i18n('addTokenGatedRoomModal.tokenIdsFieldLabel')}
                        </Label>
                        <TextField
                            id="tokenIds"
                            value={tokenIds}
                            onChange={({ target }) =>
                                void setTransientParams((t) => ({
                                    ...t,
                                    tokenIds: target.value,
                                }))
                            }
                        />
                    </>
                )}
                <Label>{i18n('addTokenGatedRoomModal.stakingLabel')}</Label>
                <div css={tw`flex`}>
                    <div css={tw`grow`}>
                        <Hint css={tw`pr-16`}>
                            <Text>{i18n('addTokenGatedRoomModal.stakingDesc')}</Text>
                        </Hint>
                    </div>
                    <div css={tw`mt-2`}>
                        <Toggle
                            value={stakingEnabled}
                            onClick={() =>
                                void setTransientParams((t) => ({
                                    ...t,
                                    stakingEnabled: !t.stakingEnabled,
                                }))
                            }
                        />
                    </div>
                </div>
                <PrimaryButton
                    disabled={!allSet}
                    type="submit"
                    css={tw`
                        w-full
                        h-12
                        rounded-[24px]
                        px-8
                        mt-10
                    `}
                >
                    <Text>{i18n('addTokenGatedRoomModal.createButtonLabel')}</Text>
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

    return (
        <div
            css={tw`
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
            `}
        >
            <div
                css={tw`
                    mr-3
                    shrink-0
                `}
            >
                <TokenLogo tokenAddress={info.address} />
            </div>
            <div
                css={tw`
                    min-w-0
                    pr-3
                `}
            >
                {'symbol' in info ? (
                    <>
                        <div css={tw`font-semibold`}>
                            <Text>{info.symbol}</Text>
                        </div>
                        <div css={tw`text-[#59799C]`}>
                            <Text>{info.name}</Text>
                        </div>
                    </>
                ) : (
                    <Text truncate>{trunc(info.address)}</Text>
                )}
            </div>
            <TokenStandardLabel tokenAddress={info.address} css={tw`ml-6`} />
            <div css={tw`grow`} />
            {isFetchingTokenStandard ? (
                <div
                    css={tw`
                        relative
                        w-4
                    `}
                >
                    <Spinner strokeWidth={1} />
                </div>
            ) : (
                <div>
                    <SecondaryButton
                        onClick={onChangeClick}
                        css={tw`
                            text-[0.875rem]
                            h-8
                            px-4
                        `}
                    >
                        <Text>{i18n('addTokenGatedRoomModal.changeButtonLabel')}</Text>
                    </SecondaryButton>
                </div>
            )}
        </div>
    )
}

AddTokenGatedRoomModal.displayName = 'AddTokenGatedRoomModal'

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
        dispatch(MiscAction.fetchKnownTokens())
    }, [])

    useEffect(() => {
        dispatch(MiscAction.setKnownTokensFilter(value))
    }, [value])

    return (
        <div
            css={tw`
                border
                border-[#F1F4F7]
                rounded-lg
            `}
        >
            <Form
                css={tw`
                    border-[#F1F4F7]
                    border-b
                    h-[56px]
                    flex
                    items-center
                `}
                onSubmit={() => {
                    if (!/^0x[a-f\d]{40}$/i.test(value)) {
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
                <div css={tw`px-4`}>
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
                <div css={tw`grow`}>
                    <input
                        ref={inputRef}
                        type="text"
                        css={tw`
                            appearance-none
                            outline-none
                            text-[#36404E]
                            placeholder:text-[#59799C]
                            text-[14px]
                            w-full
                            translate-y-[-0.06em]
                        `}
                        placeholder={i18n('addTokenGatedRoomModal.searchFieldPlaceholder')}
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
                        css={tw`
                            appearance-none
                            px-4
                            h-full
                        `}
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
                css={tw`
                    flex
                    items-center
                    h-[326px]
                `}
            >
                {knownTokens.length ? (
                    <div
                        css={tw`
                            h-full
                            overflow-auto
                            w-full
                        `}
                    >
                        <ul
                            ref={listRef}
                            css={tw`
                                text-[14px]
                                py-1.5
                            `}
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
                                        css={tw`
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
                                        `}
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
                                        <div css={tw`grow`}>
                                            <div css={tw`font-semibold`}>
                                                <Text>{t.symbol}</Text>
                                            </div>
                                            <div css={tw`text-[#59799C]`}>
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
                        css={tw`
                            text-[14px]
                            text-[#36404E]
                            text-center
                            w-full
                            p-4
                        `}
                    >
                        {isFetchingKnownTokens ? (
                            <>
                                <Spinner />
                                {i18n('addTokenGatedRoomModal.loadingTokens')}
                            </>
                        ) : (
                            i18n('addTokenGatedRoomModal.noTokens')
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
