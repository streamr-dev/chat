import { Wallet } from "ethers"
import { Buffer } from 'buffer'
import { encrypt } from "eth-sig-util"
import { bufferToHex } from 'ethereumjs-util'
import {StreamrClient} from "streamr-client"

declare global {
    interface Window { 
        ethereum: any
    }
}

export class MetamaskDelegatedAccess {
    metamaskAddress?: string 
    clientAddress?: string

    constructor(){
    }

    public async connect(): Promise<{client: StreamrClient, address: string}>{
        // enable and fetch metamask account
        await window.ethereum.enable()
        this.metamaskAddress = window.ethereum.selectedAddress
        
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
        const wallet = Wallet.createRandom()
        this.clientAddress = wallet.address
        const encryptionPublicKey = await window.ethereum.request({
            method: 'eth_getEncryptionPublicKey',
            params: [this.metamaskAddress]
        })

        const encryptedMessage = bufferToHex(
            Buffer.from(
                JSON.stringify(
                    encrypt(
                        encryptionPublicKey,
                        { data: JSON.stringify({privateKey: wallet.privateKey}) },
                        'x25519-xsalsa20-poly1305'
                    )
                ),
                'utf8'
            )
        )

        localStorage.setItem('streamr-chat-encrypted-session-key', encryptedMessage)
        return wallet
    }

    private async decryptAccount(encryptedPrivateKey: string): Promise<Wallet> {
        const decrypted = await window.ethereum.request({
            method: 'eth_decrypt',
            params: [encryptedPrivateKey, this.metamaskAddress]
        })

        const wallet = new Wallet(JSON.parse(decrypted).privateKey)
        this.clientAddress = wallet.address
        return wallet
    }
}