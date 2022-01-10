
import { Wallet } from "ethers"
import { Buffer } from 'buffer'
import { encrypt } from "@metamask/eth-sig-util"
import detectEthereumProvider from "@metamask/detect-provider"
import { MetaMaskInpageProvider } from "@metamask/providers"

export class MetamaskDelegatedAccess {
    metamask: {
        address: string
    }

    session: {
        address: string
        privateKey: string
    }

    provider: MetaMaskInpageProvider
   
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(provider: MetaMaskInpageProvider){
        this.provider = provider
        this.metamask = { address: '0x' }
        this.session = {
            address: '0x',
            privateKey: '0x'
        }
    }

    public async connect(): Promise<void>{
        // enable and fetch metamask account
        const providers = await this.provider.request({ method: 'eth_requestAccounts' }) as Array<string>
        this.metamask.address = providers[0]

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

        this.session.address = sessionWallet.address
        this.session.privateKey = sessionWallet.privateKey
    }

    private async createAccount(): Promise<Wallet>{
        const sessionWallet = Wallet.createRandom()

        const encryptionPublicKey = await this.provider.request({
            method: 'eth_getEncryptionPublicKey',
            params: [this.metamask.address]
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
            params: [encryptedPrivateKey, this.metamask.address]
        }) as string
        const wallet = new Wallet(JSON.parse(decrypted).privateKey)
        return wallet
    }
}

export const initializeMetamaskDelegatedAccess = async (): Promise<MetamaskDelegatedAccess> => {
    const provider = await detectEthereumProvider() as MetaMaskInpageProvider
    const accessManager = new MetamaskDelegatedAccess(provider)
    await accessManager.connect()
    return accessManager
}