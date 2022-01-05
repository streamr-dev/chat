
import { Wallet } from "ethers"
import { Buffer } from 'buffer'
import { encrypt } from "@metamask/eth-sig-util"
import {StreamrClient} from "streamr-client"
import detectEthereumProvider from "@metamask/detect-provider"
import { MetaMaskInpageProvider } from "@metamask/providers"

export class MetamaskDelegatedAccess {
    metamaskAddress?: string 
    sessionAddress?: string
    provider: MetaMaskInpageProvider
   
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(provider: MetaMaskInpageProvider){
        this.provider = provider
    }

    public async connect(): Promise<{client: StreamrClient, address: string}>{
        // enable and fetch metamask account
        const providers = await this.provider.request({ method: 'eth_requestAccounts' }) as Array<string>
        this.metamaskAddress = providers[0]

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
        this.sessionAddress = sessionWallet.address

        const encryptionPublicKey = await this.provider.request({
            method: 'eth_getEncryptionPublicKey',
            params: [this.metamaskAddress]
        }) as string

        const encryptedMessage = Buffer.from(
            JSON.stringify(
                encrypt({
                    publicKey: encryptionPublicKey,
                    data: JSON.stringify({privateKey: sessionWallet.privateKey}),
                    version: 'x25519-xsalsa20-poly1305'
                })
            ),
            'utf8'
        )
        .toString('hex')

        localStorage.setItem('streamr-chat-encrypted-session-key', encryptedMessage)
        return sessionWallet
    }

    private async decryptAccount(encryptedPrivateKey: string): Promise<Wallet> {
        const decrypted = await this.provider.request({
            method: 'eth_decrypt',
            params: [encryptedPrivateKey, this.metamaskAddress]
        }) as string
        const wallet = new Wallet(JSON.parse(decrypted).privateKey)
        this.sessionAddress = wallet.address
        return wallet
    }
}

export const initializeMetamaskDelegatedAccess = async (): Promise<MetamaskDelegatedAccess> => {
    const provider = await detectEthereumProvider() as MetaMaskInpageProvider
    const accessManager = new MetamaskDelegatedAccess(provider)
    await accessManager.connect()
    return accessManager
}