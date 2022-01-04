import StreamrClient from "streamr-client"
import detectEthereumProvider from "@metamask/detect-provider"

import { Wallet } from "ethers"
import { Buffer } from 'buffer'
import { encrypt } from "@metamask/eth-sig-util"
import { bufferToHex } from 'ethereumjs-util'

/* streamr-client seems alright
export const BreakTest = async () => {
    const client = new StreamrClient({
        auth: { 
            privateKey: 'ddf1e3dea49cec3351d0a1d4a729a0a3b6d5c824a0006253c2893469a0957c7e'
        }
    })
    await client.start()
    return client
}
*/

/* also works alright, metamask detect provider
export const BreakTest = async () => {
    const provider = await detectEthereumProvider() as any
    await provider.enable()
    return provider
}
*/

/* ethers/wallet also works
export const BreakTest = async () => {
    const wallet = new Wallet('ddf1e3dea49cec3351d0a1d4a729a0a3b6d5c824a0006253c2893469a0957c7e')
    return wallet
}
*/

/* IT BROOOOOKE, easy to get rid of
export const BreakTest = async () => {
    bufferToHex!
    const hex = Buffer.from('ddf1e3dea49cec3351d0a1d4a729a0a3b6d5c824a0006253c2893469a0957c7e').toString('hex')
    return hex
}
*/

export const BreakTest = async () => {
    return encrypt 
}