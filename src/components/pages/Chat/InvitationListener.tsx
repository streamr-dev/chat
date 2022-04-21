import { useEffect } from 'react'

import useContractListenerScaffolding from '../../../hooks/useInvitationListener'

type Props = {
    className?: string
}

function InvitationListener({ className }: Props) {
    const contractListener = useContractListenerScaffolding()

    useEffect(() => {
        let mounted = true

        const fn = async () => {
            if (!mounted) {
                return
            }
            await contractListener()
        }

        fn()

        return () => {
            mounted = false
        }
    }, [contractListener])
    return <></>
}

export default InvitationListener
