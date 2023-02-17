import { AvatarAction } from '$/features/avatar'
import { selectAvatar } from '$/hooks/useAvatar'
import { AvatarResolver } from '@ensdomains/ens-avatar'
import { Resolver } from '@ethersproject/providers'
import { providers } from 'ethers'
import { call, put, select } from 'redux-saga/effects'

async function isImage(src: string) {
    try {
        const { status, headers } = await fetch(src, { method: 'HEAD' })

        return status === 200 && headers.get('content-type')?.startsWith('image/')
    } catch (e: any) {
        if (typeof e?.response === 'undefined') {
            return false
        }
    }

    try {
        await new Promise<void>((resolve, reject) => {
            const img = new Image()

            img.referrerPolicy = 'no-referrer'

            img.addEventListener('load', () => void resolve())

            img.addEventListener('error', () => void reject())

            img.src = src
        })

        return true
    } catch (e) {
        // Do nothing
    }

    return false
}

async function getSrc(ens: string) {
    const provider = providers.getDefaultProvider('https://cloudflare-eth.com')

    try {
        const resolver: Resolver | null = await provider.getResolver(ens)

        if (!resolver) {
            return null
        }

        const uri: string | null = await resolver.getText('avatar')

        if (!uri) {
            return null
        }

        if (!/eip155:/i.test(uri)) {
            if (await isImage(uri)) {
                return uri
            }

            return null
        }
    } catch (e) {
        // Do nothing
    }

    const resolver = new AvatarResolver(provider, {
        cache: 300,
    })

    try {
        const uri: string | null = await resolver.getAvatar(ens, {})

        if (uri) {
            return uri
        }
    } catch (e) {
        // Do nothing
    }

    return null
}

export default function retrieveAvatar({
    ens,
}: ReturnType<typeof AvatarAction.retrieve>['payload']) {
    return call(function* () {
        const currentUri: string | null | undefined = yield select(selectAvatar(ens))

        if (typeof currentUri !== 'undefined') {
            // Don't overwrite.
            return
        }

        const uri: string | null = yield getSrc(ens)

        yield put(
            AvatarAction.set({
                ens,
                uri,
            })
        )
    })
}
