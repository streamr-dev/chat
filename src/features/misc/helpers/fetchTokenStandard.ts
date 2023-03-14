import { ToastType } from '$/components/Toast'
import { MiscAction } from '$/features/misc'
import toast, { Controller } from '$/features/toaster/helpers/toast'
import { InterfaceId, TokenStandard } from '$/features/tokenGatedRooms/types'
import { selectTokenStandard } from '$/hooks/useTokenStandard'
import { call, put, select } from 'redux-saga/effects'
import { Flag } from '$/features/flag/types'
import { BigNumber, Contract, providers } from 'ethers'
import { abi as erc20abi } from '$/contracts/tokens/ERC20Token.sol/ERC20.json'
import { abi as erc165abi } from '$/contracts/tokens/ERC165.json'
import { abi as erc777abi } from '$/contracts/tokens/ERC777Token.sol/ERC777.json'
import { Address } from '$/types'
import getWalletProvider from '$/utils/getWalletProvider'

export default function fetchTokenStandard({
    address,
    showLoadingToast,
}: ReturnType<typeof MiscAction.fetchTokenStandard>['payload']) {
    return call(function* () {
        let tc: Controller | undefined

        try {
            const currentStandard: undefined | TokenStandard = yield select(
                selectTokenStandard(address)
            )

            if (!currentStandard) {
                if (showLoadingToast) {
                    tc = yield toast({
                        title: 'Loading token info…',
                        type: ToastType.Processing,
                    })
                }

                const standard = yield* fetchUtil(address)

                yield put(
                    MiscAction.setTokenStandard({
                        address,
                        standard,
                    })
                )

                yield put(
                    MiscAction.fetchTokenMetadata({
                        tokenAddress: address,
                        tokenStandard: standard,
                        tokenIds: [],
                        fingerprint: Flag.isFetchingTokenMetadata(address, []),
                    })
                )
            }
        } catch (e) {
            // Noop.
        } finally {
            tc?.dismiss()
        }
    })
}

function* fetchUtil(address: Address) {
    let standard: TokenStandard | undefined

    yield call(function* () {
        const provider = yield* getWalletProvider()

        const contract = new Contract(
            address,
            erc165abi,
            new providers.Web3Provider(provider).getSigner()
        )

        try {
            const supportsERC1155Interface: boolean = yield contract.supportsInterface(
                InterfaceId.ERC1155
            )

            if (supportsERC1155Interface) {
                return void (standard = TokenStandard.ERC1155)
            }
        } catch (_) {
            console.warn('Failed to detect ERC1155 interface')
        }

        try {
            const supportsERC721Interface: boolean = yield contract.supportsInterface(
                InterfaceId.ERC721
            )

            if (supportsERC721Interface) {
                return void (standard = TokenStandard.ERC721)
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

            const supportsERC20DecimalsInterface: boolean = yield contract.supportsInterface(
                InterfaceId.ERC20Decimals
            )

            if (
                supportsERC20Interface ||
                (supportsERC20NameInterface &&
                    supportsERC20SymbolInterface &&
                    supportsERC20DecimalsInterface)
            ) {
                return void (standard = TokenStandard.ERC20)
            }
        } catch (_) {
            console.warn('Failed to detect ERC20 interface')
        }

        // Still, ERC20 is not compulsory ERC165 so time for specific checks.
        const erc20Contract = new Contract(
            address,
            erc20abi,
            new providers.Web3Provider(provider).getSigner()
        )

        try {
            const balanceCheck: BigNumber = yield erc20Contract.balanceOf(erc20Contract.address)

            const totalSupplyCheck: BigNumber = yield erc20Contract.totalSupply()

            if (balanceCheck.gte(0) && totalSupplyCheck.gte(0)) {
                return void (standard = TokenStandard.ERC20)
            }

            throw new Error('ERC20 balance and totalSupply checks failed')
        } catch (_) {
            console.warn('Failed to detect ERC20 methods')
        }

        // And since ERC777 doesn't include ERC165, we need to check for it separately
        const erc777Contract = new Contract(
            address,
            erc777abi,
            new providers.Web3Provider(provider).getSigner()
        )

        try {
            yield erc777Contract.granularity()

            return void (standard = TokenStandard.ERC777)
        } catch (_) {
            console.warn('Failed to detect ERC777 interface')
        }

        standard = TokenStandard.Unknown
    })

    if (!standard) {
        throw new Error('Invalid token standard')
    }

    return standard
}
