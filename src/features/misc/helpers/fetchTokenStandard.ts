import { ToastType } from '$/components/Toast'
import { MiscAction } from '$/features/misc'
import { InterfaceId, TokenStandard } from '$/features/tokenGatedRooms/types'
import { selectTokenStandard } from '$/hooks/useTokenStandard'
import { call, cancelled, put, select } from 'redux-saga/effects'
import { Flag } from '$/features/flag/types'
import { BigNumber, Contract, providers } from 'ethers'
import { abi as erc20abi } from '$/contracts/tokens/ERC20Token.sol/ERC20.json'
import { abi as erc165abi } from '$/contracts/tokens/ERC165.json'
import { abi as erc777abi } from '$/contracts/tokens/ERC777Token.sol/ERC777.json'
import retoast from '$/features/misc/helpers/retoast'
import { JSON_RPC_URL } from '$/consts'

export default function fetchTokenStandard({
    address,
    showLoadingToast,
}: ReturnType<typeof MiscAction.fetchTokenStandard>['payload']) {
    return call(function* () {
        const toast = retoast()

        let tokenStandard: TokenStandard = TokenStandard.Unknown

        const currentStandard: TokenStandard | undefined = yield select(
            selectTokenStandard(address)
        )

        try {
            yield call(function* () {
                if (currentStandard) {
                    return void (tokenStandard = currentStandard)
                }

                if (showLoadingToast) {
                    yield toast.pop({
                        title: 'Loading token standard…',
                        type: ToastType.Processing,
                    })
                }

                const provider = new providers.JsonRpcProvider(JSON_RPC_URL)

                const contract = new Contract(address, erc165abi, provider)

                try {
                    const supportsERC1155Interface: boolean = yield contract.supportsInterface(
                        InterfaceId.ERC1155
                    )

                    if (supportsERC1155Interface) {
                        return void (tokenStandard = TokenStandard.ERC1155)
                    }
                } catch (_) {
                    console.warn('Failed to detect ERC1155 interface')
                }

                try {
                    const supportsERC721Interface: boolean = yield contract.supportsInterface(
                        InterfaceId.ERC721
                    )

                    if (supportsERC721Interface) {
                        return void (tokenStandard = TokenStandard.ERC721)
                    }
                } catch (_) {
                    console.warn('Failed to detect ERC721 interface')
                }

                try {
                    const supportsERC20Interface: boolean = yield contract.supportsInterface(
                        InterfaceId.ERC20
                    )

                    const supportsERC20NameInterface: boolean = yield contract.supportsInterface(
                        InterfaceId.ERC20Name
                    )

                    const supportsERC20SymbolInterface: boolean = yield contract.supportsInterface(
                        InterfaceId.ERC20Symbol
                    )

                    const supportsERC20DecimalsInterface: boolean =
                        yield contract.supportsInterface(InterfaceId.ERC20Decimals)

                    if (
                        supportsERC20Interface ||
                        (supportsERC20NameInterface &&
                            supportsERC20SymbolInterface &&
                            supportsERC20DecimalsInterface)
                    ) {
                        return void (tokenStandard = TokenStandard.ERC20)
                    }
                } catch (_) {
                    console.warn('Failed to detect ERC20 interface')
                }

                // Still, ERC20 is not compulsory ERC165 so time for specific checks.
                const erc20Contract = new Contract(address, erc20abi, provider)

                try {
                    const balanceCheck: BigNumber = yield erc20Contract.balanceOf(
                        erc20Contract.address
                    )

                    const totalSupplyCheck: BigNumber = yield erc20Contract.totalSupply()

                    if (balanceCheck.gte(0) && totalSupplyCheck.gte(0)) {
                        return void (tokenStandard = TokenStandard.ERC20)
                    }

                    throw new Error('ERC20 balance and totalSupply checks failed')
                } catch (_) {
                    console.warn('Failed to detect ERC20 methods')
                }

                // And since ERC777 doesn't include ERC165, we need to check for it separately
                const erc777Contract = new Contract(address, erc777abi, provider)

                try {
                    yield erc777Contract.granularity()

                    return void (tokenStandard = TokenStandard.ERC777)
                } catch (_) {
                    console.warn('Failed to detect ERC777 interface')
                }
            })

            if (currentStandard !== tokenStandard) {
                yield put(
                    MiscAction.setTokenStandard({
                        address,
                        standard: tokenStandard,
                    })
                )
            }

            yield put(
                MiscAction.fetchTokenMetadata({
                    tokenAddress: address,
                    tokenStandard,
                    tokenIds: [],
                    fingerprint: Flag.isFetchingTokenMetadata(address, []),
                })
            )
        } catch (e) {
            // Noop.
        } finally {
            toast.discard({ asap: yield cancelled() })
        }
    })
}
