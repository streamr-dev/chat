import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { takeEvery } from 'redux-saga/effects'
import handleError from '$/utils/handleError'
import { JoinPolicyRegistryAddress } from '$/features/tokenGatedRooms/utils/const'

import { Contract, providers } from 'ethers'

import * as JoinPolicyRegistry from '$/contracts/JoinPolicyRegistry.sol/JoinPolicyRegistry.json'

import * as ERC20JoinPolicy from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import * as ERC721JoinPolicy from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import * as ERC777JoinPolicy from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import * as ERC1155JoinPolicy from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'

import { TokenTypes } from '$/features/tokenGatedRooms/types'

function* onJoin({
    payload: { roomId, tokenAddress, provider, tokenId, stakingEnabled, tokenType },
}: ReturnType<typeof TokenGatedRoomAction.join>) {
    try {
        // fetch policy address from registry
        const signer = new providers.Web3Provider(provider).getSigner()

        const policyRegistry = new Contract(
            JoinPolicyRegistryAddress,
            JoinPolicyRegistry.abi,
            signer
        )

        const policyAddress: string = yield policyRegistry.getPolicy(
            tokenAddress,
            tokenId,
            roomId,
            stakingEnabled
        )

        // assemble policy contract
        let policyAbi: any
        switch (tokenType.standard) {
            case TokenTypes.ERC20.standard:
                policyAbi = ERC20JoinPolicy.abi
                break
            case TokenTypes.ERC721.standard:
                policyAbi = ERC721JoinPolicy.abi
                break
            case TokenTypes.ERC777.standard:
                policyAbi = ERC777JoinPolicy.abi
                break
            case TokenTypes.ERC1155.standard:
                policyAbi = ERC1155JoinPolicy.abi
                break
            default:
                throw new Error(`Unsupported token type: ${tokenType.standard}`)
        }

        const policy = new Contract(policyAddress, policyAbi, signer)

        // call requestDelegatedJoin on policy
        yield policy.requestDelegatedJoin()
    } catch (e) {
        handleError(e)
    }
}

export default function* join() {
    yield takeEvery(TokenGatedRoomAction.join, onJoin)
}
