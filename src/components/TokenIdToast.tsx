import TextField from '$/components/TextField'
import Toast, { ToastableProps, ToastType } from '$/components/Toast'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { useState } from 'react'
import tw from 'twin.macro'
import { BigNumber } from 'ethers'
import i18n from '$/utils/i18n'

interface Props extends Omit<ToastableProps, 'onResolve'> {
    onResolve?: (tokenId: string) => void
    tokenStandard: TokenStandard
}

export default function TokenIdToast({ onResolve, onReject, tokenStandard, ...props }: Props) {
    const [tokenId, setTokenId] = useState('')

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
            onResolve={() => void onResolve?.(tokenId)}
            onReject={onReject}
            title={i18n('tokenIdToast.title')}
            type={ToastType.Warning}
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

                            onReject?.()
                        }}
                    />
                </>
            }
            okLabel={i18n('tokenIdToast.okLabel')}
            cancelLabel={i18n('tokenIdToast.cancelLabel')}
        />
    )
}
