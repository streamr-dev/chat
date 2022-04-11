import Identicon from 'identicon.js'
import { keccak256 } from 'js-sha3'

const AVATAR_OPTIONS: any = {
    size: 32,
    background: [255, 255, 255, 255],
}

export default function getIdenticon(seed: string): string {
    const hash = keccak256(seed)
    const LocalStorageKey = `identicon:${hash}`
    const localIdenticon = localStorage.getItem(LocalStorageKey)

    if (localIdenticon) {
        return localIdenticon
    }

    const identicon = new Identicon(hash, AVATAR_OPTIONS).toString()
    localStorage.setItem(LocalStorageKey, identicon)

    return identicon.toString()
}
