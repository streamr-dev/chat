import TextField from '$/components/TextField'
import Toast, { ToastableProps, ToastType } from '$/components/Toast'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { useEffect, useRef, useState } from 'react'
import tw from 'twin.macro'
import { BigNumber } from 'ethers'
import i18n from '$/utils/i18n'

interface Props extends Omit<ToastableProps, 'onProceed'> {
    onProceed?: (tokenId: string) => void
    tokenStandard: TokenStandard
}

function useAbortController(abortSignal?: AbortSignal) {
    const abortControllerRef = useRef(new AbortController())

    useEffect(() => {
        if (!abortSignal) {
            return () => {
                // Do nothing
            }
        }

        function onAbort() {
            abortControllerRef.current.abort()
        }

        if (abortSignal.aborted) {
            onAbort()

            return () => {
                // Do nothing
            }
        }

        abortSignal.addEventListener('abort', onAbort)

        return () => {
            abortSignal.removeEventListener('abort', onAbort)
        }
    }, [abortSignal])

    return abortControllerRef.current
}

export default function TokenIdToast({ onProceed, tokenStandard, abortSignal, ...props }: Props) {
    const [tokenId, setTokenId] = useState('')

    const abortController = useAbortController(abortSignal)

    const canSubmit = (() => {
        try {
            return BigNumber.from(tokenId).gte(0)
        } catch (e) {
            // Do nothing
        }

        return false
    })()

    return (
        <Toast
            {...props}
            onProceed={() => void onProceed?.(tokenId)}
            title={i18n('tokenIdToast.title')}
            type={ToastType.Warning}
            abortSignal={abortController.signal}
            canSubmit={canSubmit}
            desc={
                <>
                    <p>{i18n('tokenIdToast.message', tokenStandard)}</p>
                    <TextField
                        type="text"
                        value={tokenId}
                        onChange={({ target }) => void setTokenId(target.value)}
                        placeholder={i18n('tokenIdToast.tokenIdInputPlaceholder')}
                        css={tw`
                            h-12
                            mt-4
                            mb-3
                            text-[14px]
                        `}
                        autoFocus
                        onKeyDown={({ key }) => {
                            if (key !== 'Escape') {
                                return
                            }

                            if (tokenId !== '') {
                                return void setTokenId('')
                            }

                            abortController.abort()
                        }}
                    />
                </>
            }
            okLabel={i18n('tokenIdToast.okLabel')}
            cancelLabel={i18n('tokenIdToast.cancelLabel')}
        />
    )
}
