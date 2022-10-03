import { Contract, providers } from 'ethers'
import { useEffect, useState } from 'react'
import { abi } from '../contracts/StreamRegistryV3.sol/StreamRegistryV3.json'
import { StreamRegistryV3 } from '../contracts/StreamRegistryV3.sol/StreamRegistryV3'

const StreamRegistryAddress = '0x0D483E10612F327FC11965Fc82E90dC19b141641'

export default function useStreamRegistry() {
    const [registry, setRegistry] = useState<StreamRegistryV3>()

    useEffect(() => {
        let mounted = true

        let provider: providers.WebSocketProvider | null = null

        let interval: number | null = null

        async function teardown() {
            if (provider) {
                try {
                    await provider.destroy()
                } catch (e) {
                    // Shush!
                }
                provider = null
            }

            if (interval) {
                window.clearInterval(interval)
                interval = null
            }
        }

        function fn() {
            teardown()

            provider = new providers.WebSocketProvider('wss://ws-matic-mainnet.chainstacklabs.com')

            // Keep the provider alive by… replacing it when it becomes waste.
            interval = window.setInterval(() => {
                switch (provider?.websocket.readyState) {
                    case WebSocket.OPEN:
                    case WebSocket.CONNECTING:
                        return
                    default:
                        break
                }

                // We need a new instance.
                if (mounted) {
                    fn()
                }
            }, 2500)

            setRegistry(new Contract(StreamRegistryAddress, abi, provider) as StreamRegistryV3)
        }

        fn()

        return () => {
            mounted = false
            teardown()
        }
    }, [])

    return registry
}
