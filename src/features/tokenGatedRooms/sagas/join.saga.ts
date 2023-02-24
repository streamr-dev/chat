import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { takeEvery } from 'redux-saga/effects'
import handleError from '$/utils/handleError'
import { Contract } from 'ethers'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import { TokenTypes } from '$/features/tokenGatedRooms/types'
import getPolicyRegistry from '$/features/tokenGatedRooms/utils/getPolicyRegistry'

function* onJoin({
    payload: { roomId, tokenAddress, provider, stakingEnabled, tokenType },
}: ReturnType<typeof TokenGatedRoomAction.join>) {
    try {
        const policyRegistry = getPolicyRegistry(provider)

        const policyAddress: string = yield policyRegistry.getPolicy(
            tokenAddress,
            0, // tokenId = 0 for erc20
            roomId,
            stakingEnabled
        )

        // assemble policy contract
        let policyAbi: any
        switch (tokenType.standard) {
            case TokenTypes.ERC20.standard:
                policyAbi = ERC20JoinPolicyAbi
                break
            case TokenTypes.ERC721.standard:
                policyAbi = ERC721JoinPolicyAbi
                break
            case TokenTypes.ERC777.standard:
                policyAbi = ERC777JoinPolicyAbi
                break
            case TokenTypes.ERC1155.standard:
                policyAbi = ERC1155JoinPolicyAbi
                break
            default:
                throw new Error(`Unsupported token type: ${tokenType.standard}`)
        }

        const policy = new Contract(policyAddress, policyAbi, signer)

        // call requestDelegatedJoin on policy
        const tx: { [key: string]: any } = yield policy.requestDelegatedJoin()

        yield tx.wait()
    } catch (e) {
        handleError(e)
    }
}

export default function* join() {
    yield takeEvery(TokenGatedRoomAction.join, onJoin)
}
