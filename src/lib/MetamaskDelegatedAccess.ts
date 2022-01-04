
import { Wallet } from "ethers"
import { Buffer } from 'buffer'
import { encrypt } from "eth-sig-util"
import { bufferToHex } from 'ethereumjs-util'
import {StreamrClient} from "streamr-client"
import detectEthereumProvider from "@metamask/detect-provider"

export class MetamaskDelegatedAccess {
    metamaskAddress?: string 
    clientAddress?: string
    provider?: any
   
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(provider: any){
        this.provider = provider
    }

    public async connect(): Promise<{client: StreamrClient, address: string}>{
        // enable and fetch metamask account
        await this.provider.enable()
        this.metamaskAddress = this.provider.selectedAddress

        // get the delegated key 
        let sessionWallet: Wallet
        const encryptedPrivateKey = localStorage.getItem('streamr-chat-encrypted-session-key')

        if (!encryptedPrivateKey){
            // generate delegated privateKey, encrypt, store and use
            sessionWallet = await this.createAccount()
        } else {
            // decrypt and use
            sessionWallet = await this.decryptAccount(encryptedPrivateKey)
        }

        return {
            client: new StreamrClient({
                auth: { 
                    privateKey: sessionWallet.privateKey
                }
            }),
            address: this.metamaskAddress!,
        }
    }

    private async createAccount(): Promise<Wallet>{
        const sessionWallet = Wallet.createRandom()
        this.clientAddress = sessionWallet.address

        const encryptionPublicKey = await this.provider.request({
            method: 'eth_getEncryptionPublicKey',
            params: [this.metamaskAddress]
        })

        const encryptedMessage = bufferToHex(
            Buffer.from(
                JSON.stringify(
                    encrypt(
                        encryptionPublicKey,
                        { data: JSON.stringify({privateKey: sessionWallet.privateKey}) },
                        'x25519-xsalsa20-poly1305'
                    )
                ),
                'utf8'
            )
        )

        localStorage.setItem('streamr-chat-encrypted-session-key', encryptedMessage)
        return sessionWallet
    }

    private async decryptAccount(encryptedPrivateKey: string): Promise<Wallet> {
        const decrypted = await this.provider.request({
            method: 'eth_decrypt',
            params: [encryptedPrivateKey, this.metamaskAddress]
        })
        const wallet = new Wallet(JSON.parse(decrypted).privateKey)
        this.clientAddress = wallet.address
        return wallet
    }
}

export const initializeMetamaskDelegatedAccess = async (): Promise<MetamaskDelegatedAccess> => {
    const provider = await detectEthereumProvider()
    return new MetamaskDelegatedAccess(provider)
}