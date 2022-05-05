import { useEffect } from 'react'

import useInvitationListener from '../../../hooks/useInvitationListener'

type Props = {
    className?: string
}

function InvitationListener({ className }: Props) {
    const contractListener = useInvitationListener()

    useEffect(() => {
        const fn = async () => {
            await contractListener()
        }

        fn()
    }, [contractListener])
    return null
}

export default InvitationListener
