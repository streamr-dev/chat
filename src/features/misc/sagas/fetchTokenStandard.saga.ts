import { MiscAction } from '$/features/misc'
import { BigNumber, Contract, providers } from 'ethers'
import { put, select, takeLatest } from 'redux-saga/effects'
import { abi as erc20abi } from '$/contracts/tokens/ERC20Token.sol/ERC20.json'
import { abi as erc165abi } from '$/contracts/tokens/ERC165.json' // supportsInterface
import { InterfaceId, TokenStandard } from '$/features/tokenGatedRooms/types'
import { Address } from '$/types'
import { Provider } from '@web3-react/types'
import { Flag } from '$/features/flag/types'
import { FlagAction } from '$/features/flag'
import { selectTokenStandard } from '$/hooks/useTokenStandard'
import { Id, toast } from 'react-toastify'
import { loading } from '$/utils/toaster'

async function getTokenStandard(address: Address, provider: Provider) {
    const contract = new Contract(
        address,
        erc165abi,
        new providers.Web3Provider(provider).getSigner()
    )

    try {
        const supportsERC1155Interface: boolean = await contract.supportsInterface(
            InterfaceId.ERC1155
        )

        if (supportsERC1155Interface) {
            return TokenStandard.ERC1155
        }
    } catch (e) {
        console.warn('Failed to detect ERC1155 interface', e)
    }

    try {
        const supportsERC721Interface: boolean = await contract.supportsInterface(
            InterfaceId.ERC721
        )

        if (supportsERC721Interface) {
            return TokenStandard.ERC721
        }
    } catch (e) {
        console.warn('Failed to detect ERC721 interface', e)
    }

    try {
        const supportsERC20Interface: boolean = await contract.supportsInterface(InterfaceId.ERC20)

        const supportsERC20NameInterface: boolean = await contract.supportsInterface(
            InterfaceId.ERC20Name
        )

        const supportsERC20SymbolInterface: boolean = await contract.supportsInterface(
            InterfaceId.ERC20Symbol
        )

        const supportsERC20DecimalsInterface: boolean = await contract.supportsInterface(
            InterfaceId.ERC20Decimals
        )

        if (
            supportsERC20Interface ||
            (supportsERC20NameInterface &&
                supportsERC20SymbolInterface &&
                supportsERC20DecimalsInterface)
        ) {
            return TokenStandard.ERC20
        }
    } catch (e) {
        console.warn('Failed to detect ERC20 interface', e)
    }

    // Still, erc20 is not compulsory erc165 so time for specific checks.
    const erc20Contract = new Contract(
        address,
        erc20abi,
        new providers.Web3Provider(provider).getSigner()
    )

    try {
        const balanceCheck: BigNumber = await erc20Contract.balanceOf(erc20Contract.address)

        const totalSupplyCheck: BigNumber = await erc20Contract.totalSupply()

        if (balanceCheck.gte(0) && totalSupplyCheck.gte(0)) {
            return TokenStandard.ERC20
        }
    } catch (e) {
        // Yeah, all that checking and it falls into the Unknown bucket.
    }

    return TokenStandard.Unknown
}

export default function* fetchTokenStandard() {
    yield takeLatest(MiscAction.fetchTokenStandard, function* ({ payload: { address, provider } }) {
        let toastId: undefined | Id = undefined

        try {
            toastId = loading('Loading token info…')

            yield put(FlagAction.set(Flag.isFetchingTokenStandard(address)))

            const currentStandard: undefined | TokenStandard = yield select(
                selectTokenStandard(address)
            )

            if (!currentStandard) {
                const standard: TokenStandard = yield getTokenStandard(address, provider)

                yield put(
                    MiscAction.setTokenStandard({
                        address,
                        standard,
                    })
                )
            }
        } catch (e) {
            // Noop.
        } finally {
            if (toastId) {
                toast.dismiss(toastId)
            }

            yield put(FlagAction.unset(Flag.isFetchingTokenStandard(address)))
        }
    })
}
