import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'
import * as _ERC20JoinPolicyArtifact from '../artifacts/ERC20JoinPolicy.json'
import { Contract, providers } from 'ethers'
import { useStore } from '../components/Store'

const ERC20JoinPolicyArtifact = _ERC20JoinPolicyArtifact as { [key: string]: any }

type Options = {
    invitee?: string
    stream?: Stream
    streamId?: string
}

type Inviter = ({ invitee, stream }: Options) => Promise<void>

export default function useErc20JoinPolicy(): Inviter {
    const { ethereumProvider } = useStore()
    const ERC20Address = ''
    const ERC20JoinPolicyAddress = '0xF2ffB432021ab887171BDf67fad054C5801a8dec'
    
    return useCallback(async ({ invitee, stream }: Options) => {
        try {
            const contract = new Contract(
                ERC20JoinPolicyAddress, 
                ERC20JoinPolicyArtifact.abi, 
                new providers.Web3Provider(ethereumProvider as any).getSigner()
            )
            const tx = await contract.functions.requestJoin()
            console.log('erc20joinpolicy tx', tx)

        } catch (e: any) {
            console.warn(e.data.message)
        }
    }, [])
}