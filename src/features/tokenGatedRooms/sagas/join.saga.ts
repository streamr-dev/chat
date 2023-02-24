import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { takeEvery } from 'redux-saga/effects'
import handleError from '$/utils/handleError'
import { Contract } from 'ethers'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import getPolicyRegistry from '$/features/tokenGatedRooms/utils/getPolicyRegistry'

const Abi: Record<
    TokenStandard,
    | typeof ERC20JoinPolicyAbi
    | typeof ERC721JoinPolicyAbi
    | typeof ERC777JoinPolicyAbi
    | typeof ERC1155JoinPolicyAbi
    | null
> = {
    [TokenStandard.ERC1155]: ERC1155JoinPolicyAbi,
    [TokenStandard.ERC20]: ERC20JoinPolicyAbi,
    [TokenStandard.ERC721]: ERC721JoinPolicyAbi,
    [TokenStandard.ERC777]: ERC777JoinPolicyAbi,
    [TokenStandard.Unknown]: null,
}

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

        const abi = Abi[tokenType.standard]

        if (!abi) {
            throw new Error(`Unsupported token type: ${tokenType.standard}`)
        }

        const policy = new Contract(policyAddress, abi, policyRegistry.signer)

        const tx: Record<string, any> = yield policy.requestDelegatedJoin()

        yield tx.wait()
    } catch (e) {
        handleError(e)
    }
}

export default function* join() {
    yield takeEvery(TokenGatedRoomAction.join, onJoin)
}
