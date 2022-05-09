import { useEffect } from 'react'
import { useStore } from '../../../Store'
import useInviterSelf from '../../../../hooks/useInviterSelf'
import listenForInvites from './listenForInvites'

function InvitationListener() {
    const { account } = useStore()

    const inviteSelf = useInviterSelf()

    useEffect(() => {
        // By returning the result of `listenForInvites` here we're taking care of
        // useEffect's clean-up callback right away. Inspect `listenForInvites`
        // for details.
        return listenForInvites(account, {
            async onAccept(streamId: string) {
                await inviteSelf({
                    streamIds: [streamId],
                })
            },
        })
    }, [account, inviteSelf])

    return null
}

export default InvitationListener
