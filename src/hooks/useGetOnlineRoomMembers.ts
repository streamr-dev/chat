import { db } from '../utils/db'
import { MessagePayload, RoomId } from '../utils/types'
import { StreamID, toStreamPartID } from 'streamr-client-protocol'

import { useCallback, useState } from 'react'
import { getTrackerRegistryFromContract, Stream, StreamPermission } from 'streamr-client'
import { useSend } from '../components/pages/Chat/MessageTransmitter'
import { useStore } from '../components/Store'
import { Wallet } from 'ethers'

type Options = {
    streamId: StreamID
}
/*
export type OnlineMember = {
    metamaskAddress?: string
    sessionAddress: string
    sessionId: string
}*/

//type OnlineRoomMemberGetter = ({ streamId }: Options) => Promise<OnlineMember[]>
type OnlineRoomMemberGetter = ({ streamId }: Options) => Promise<string[]>

export default function useGetOnlineRoomMembers(): OnlineRoomMemberGetter {
    const {account, session: {streamrClient, wallet}} = useStore()

    return useCallback(async ({ streamId }: Options) => {
        if (!wallet){
            throw new Error('No session wallet found')
        }
        const PARTITION = 0
        const provider = streamrClient!.getMainnetProvider()
        const registry = await getTrackerRegistryFromContract({
            contractAddress: '0xab9BEb0e8B106078c953CcAB4D6bF9142BeF854d',
            jsonRpcProvider: provider
        })
        const tracker = registry.getTracker(toStreamPartID(streamId, PARTITION))
        console.log('tracker:', tracker)

        const streamUrl = `${tracker.http}/topology/${encodeURIComponent(streamId)}`
        //http://brubeck4.streamr.network:30301/topology/:streamID
        console.log('streamUrl:', streamUrl)
        const response = await fetch(streamUrl)
        const json = await response.json()
        console.log('json:', json)

        return Object.keys(json[`${streamId}#0`]).map((key) => {
            const sessionAddress = key.split('#')[0]
            const sessionId = key.split('#')[1]

            return sessionAddress/*

            // Dirty fix to exercise the metamaskAddress field on one's own session
            // Should be replaced by a call to DelegatedAccessRegistry smart contract, once ready
            if (sessionAddress === wallet.address.toLowerCase()){
                return {
                    metamaskAddress: account,
                    sessionAddress,
                    sessionId
                }
            }
            return {
                sessionAddress,
                sessionId,
            }*/
        })
    }, [])
}
