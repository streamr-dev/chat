import { RoomAction } from "$/features/room"
import { call, takeEvery } from "redux-saga/effects"
import { Contract, Wallet, providers } from 'ethers'
import * as DelegatedAccessRegistry from '../../../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'
import { StreamPermission } from "streamr-client"
import { WalletAction } from "$/features/wallet"
import { useWalletIntegrationId } from "$/features/wallet/hooks"
import getConnector from "$/utils/getConnector"
import { useDelegatedAccount } from "$/features/delegation/hooks"
import EthCrypto from 'eth-crypto'
import requestDelegatedPrivateKey from "$/utils/requestDelegatedPrivateKey"
import getDefaultWeb3Account from "$/utils/getDefaultWeb3Account"

const DelegatedAccessRegistryAddress = '0xf5803cdA6352c515Ee11256EAA547BE8422cC4EE'

export const signDelegatedChallenge = async (
    metamaskAddress: string,
    delegatedPrivateKey: string,
    challengeType: 0 | 1 // 0 = authorize | 1 = revoke
) => {
    const delegated = new Wallet(delegatedPrivateKey)
    const message = EthCrypto.hash.keccak256([
        { type: 'uint256', value: challengeType.toString() },
        { type: 'address', value: metamaskAddress }
    ])

    const signature = EthCrypto.sign(delegated.privateKey, message)

    return {
        delegated, message, signature
    }
}


function* onAuthorizeDelegatedAccount({
    payload: provider
}:
    ReturnType<typeof WalletAction.authorizeDelegatedAccount>) {
    console.log('calling authorize delegate saga')
    // setup 
    //const provider = getConnector(integrationId)[0].provider!
    const delegatedAddress = useDelegatedAccount()

    console.log('delegatedAddress', delegatedAddress)
    const metamaskWallet: Wallet = yield getDefaultWeb3Account(provider)

    const delegatedPrivateKey: string = yield requestDelegatedPrivateKey(provider!, metamaskWallet.address)
    // sign the challenge
    const { signature } = yield signDelegatedChallenge(
        metamaskWallet.address,
        delegatedPrivateKey,
        0
    )

    // send the tx with the signed challenge
    const ethereumProvider = new providers.Web3Provider(provider!)

    const contract = new Contract(DelegatedAccessRegistryAddress, DelegatedAccessRegistry.abi, ethereumProvider)

    yield contract.functions.authorize(
        delegatedAddress,
        signature
    )
}


export default function* authorizeDelegatedAccount() {
    yield takeEvery(WalletAction.authorizeDelegatedAccount, onAuthorizeDelegatedAccount)
}


