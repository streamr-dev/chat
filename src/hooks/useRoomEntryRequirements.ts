import { RoomId } from '$/features/room/types'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import useCachedTokenGate from '$/hooks/useCachedTokenGate'
import useTokenMetadata from '$/hooks/useTokenMetadata'
import useTokenStandard from '$/hooks/useTokenStandard'
import { Address, Erc20, Erc721, TokenMetadata } from '$/types'
import { formatUnits } from '@ethersproject/units'
import { useMemo } from 'react'

export interface EntryRequirements {
    tokenAddress: Address
    quantity?: string
    unit: string
}

function isErc20(tm: TokenMetadata): tm is Erc20 {
    return (
        'name' in tm &&
        !!tm.name &&
        'symbol' in tm &&
        !!tm.symbol &&
        'decimals' in tm &&
        !!tm.decimals
    )
}

function isErc721(tm: TokenMetadata): tm is Erc721 {
    return 'name' in tm && !!tm.name && 'symbol' in tm && !!tm.symbol && 'uris' in tm && !!tm.uris
}

export default function useRoomEntryRequirements(roomId: RoomId | undefined) {
    const tokenGate = useCachedTokenGate(roomId)

    const { tokenAddress, tokenIds = [] } = tokenGate || {}

    const standard = useTokenStandard(tokenAddress)

    const tokenMetadata = useTokenMetadata(tokenAddress, tokenIds)

    let unit: string | undefined = undefined

    let quantity: string | undefined

    if (standard === TokenStandard.ERC1155) {
        unit = 'ERC-1155 NFT'
    }

    if (standard === TokenStandard.ERC777) {
        unit = 'ERC-777 NFT'
    }

    if (tokenMetadata && tokenGate) {
        if (standard === TokenStandard.ERC20 && isErc20(tokenMetadata)) {
            unit = tokenMetadata.symbol

            quantity = formatUnits(tokenGate.minRequiredBalance, tokenMetadata.decimals).replace(
                /\.0$/,
                ''
            )
        }

        if (standard === TokenStandard.ERC721 && isErc721(tokenMetadata)) {
            unit = tokenMetadata.name
        }
    }

    const result = useMemo(
        () =>
            !unit || !tokenAddress
                ? null
                : {
                      tokenAddress,
                      unit,
                      quantity,
                  },
        [tokenAddress, unit, quantity]
    ) as EntryRequirements | null

    if (typeof tokenGate === 'undefined') {
        return
    }

    if (!tokenGate || standard === TokenStandard.Unknown) {
        return null
    }

    if (typeof standard === 'undefined') {
        return
    }

    return result
}
