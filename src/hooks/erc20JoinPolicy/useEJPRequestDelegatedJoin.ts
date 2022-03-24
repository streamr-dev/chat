import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'
import * as _ERC20JoinPolicyArtifact from '../../artifacts/ERC20JoinPolicy.json'
import { Contract, providers } from 'ethers'
import { useStore } from '../../components/Store'
import getContractAt from '../../getters/getContractAt'

const ERC20JoinPolicyArtifact = _ERC20JoinPolicyArtifact as {
    [key: string]: any
}

type Options = {
    invitee?: string
    stream?: Stream
    streamId?: string
}

type Inviter = ({ invitee, stream }: Options) => Promise<void>

export default function useEJPRequestDelegatedJoin(): Inviter {
    const {
        ethereumProvider,
        session: { wallet },
    } = useStore()
    const ERC20Address = ''
    const ERC20JoinPolicyAddress = '0xF2ffB432021ab887171BDf67fad054C5801a8dec'

    return useCallback(async ({ invitee, stream }: Options) => {
        try {
            const contract = getContractAt({
                address: ERC20JoinPolicyAddress,
                artifact: 'ERC20JoinPolicy',
                provider: ethereumProvider as any,
            })
            const tx = await contract.functions.requestDelegatedJoin(
                wallet!.address
            )
            console.log('erc20joinpolicy tx', tx)
        } catch (e: any) {
            console.warn(e.data.message)
        }
    }, [])
}
