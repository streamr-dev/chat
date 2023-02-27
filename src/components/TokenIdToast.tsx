import TextField from '$/components/TextField'
import Toast, { ToastableProps, ToastType } from '$/components/Toast'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { useEffect, useRef, useState } from 'react'
import tw from 'twin.macro'
import { BigNumber } from 'ethers'

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
            title="Token ID required"
            type={ToastType.Warning}
            abortSignal={abortController.signal}
            canSubmit={canSubmit}
            desc={
                <>
                    <p>
                        This room is gated by an {tokenStandard} token. Tell us your token ID to
                        confirm&nbsp;ownership.
                    </p>
                    <TextField
                        type="text"
                        value={tokenId}
                        onChange={({ target }) => void setTokenId(target.value)}
                        placeholder="Type here…"
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
            okLabel="Done"
            cancelLabel="Cancel"
        />
    )
}
