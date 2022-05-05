import { useEffect } from 'react'

import useContractListenerScaffolding from '../../../hooks/useInvitationListener'

type Props = {
    className?: string
}

function InvitationListener({ className }: Props) {
    const contractListener = useContractListenerScaffolding()

    useEffect(() => {
        const fn = async () => {
            await contractListener()
        }

        fn()
    }, [contractListener])
    return null
}

export default InvitationListener
