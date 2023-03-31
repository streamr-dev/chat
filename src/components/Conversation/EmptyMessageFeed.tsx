import tw from 'twin.macro'
import Text from '../Text'
import AddMemberIcon from '$/icons/AddMemberIcon'
import trunc from '$/utils/trunc'
import UtilityButton from '../UtilityButton'
import useSelectedRoom from '$/hooks/useSelectedRoom'
import useDisplayUsername from '$/hooks/useDisplayUsername'
import useJustInvited from '$/hooks/useJustInvited'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useAcceptInvite from '$/hooks/useAcceptInvite'
import useIsInviteBeingAccepted from '$/hooks/useIsInviteBeingAccepted'
import Spinner from '$/components/Spinner'
import useAbility from '$/hooks/useAbility'
import { StreamPermission } from 'streamr-client'
import useAnonAccount from '$/hooks/useAnonAccount'
import usePrivacy from '$/hooks/usePrivacy'
import { PrivacySetting } from '$/types'
import useTokenMetadata from '$/hooks/useTokenMetadata'
import i18n from '$/utils/i18n'
import useCachedTokenGate from '$/hooks/useCachedTokenGate'

interface Props {
    onAddMemberClick?: () => void
}

export default function EmptyMessageFeed({ onAddMemberClick }: Props) {
    const roomId = useSelectedRoomId()

    const walletAccount = useWalletAccount()

    const isPublic = useAbility(roomId, useAnonAccount(roomId), StreamPermission.SUBSCRIBE)

    const canGrant = !!useAbility(roomId, walletAccount, StreamPermission.GRANT)

    const invited = useJustInvited(useSelectedRoomId(), walletAccount)

    const isTokenGated = usePrivacy(roomId) === PrivacySetting.TokenGated

    if (typeof isPublic === 'undefined') {
        return null
    }

    return (
        <div
            css={[
                tw`
                    items-center
                    text-[#59799c]
                    flex
                    flex-col
                    h-full
                    justify-center
                    overflow-hidden
                `,
            ]}
        >
            {isPublic ? null : (
                <>
                    <div
                        css={tw`
                            block
                            tracking-[0.02em]
                            mb-8
                            empty:hidden
                            px-16
                        `}
                    >
                        <Credits />
                    </div>
                    {invited ? (
                        <JoinButton />
                    ) : isTokenGated ? (
                        <TokenGatedMessage />
                    ) : (
                        <UtilityButton
                            disabled={!canGrant}
                            onClick={onAddMemberClick}
                            css={tw`
                                flex
                                items-center
                            `}
                        >
                            <div tw="mr-2">
                                <AddMemberIcon />
                            </div>
                            <div tw="grow">
                                <Text>{i18n('common.addMember')}</Text>
                            </div>
                        </UtilityButton>
                    )}
                </>
            )}
        </div>
    )
}

function TokenGatedMessage() {
    const tokenData = useCachedTokenGate(useSelectedRoomId())
    const room = useSelectedRoom()

    const tokenMetadata = useTokenMetadata(tokenData!.tokenAddress, tokenData!.tokenIds)

    const displayTokenAddress = useDisplayUsername(tokenData!.tokenAddress, {
        fallback: tokenData!.tokenAddress,
    })

    if (!tokenMetadata || !tokenData || !tokenData.tokenAddress || !room || !room.tokenType) {
        return null
    }
    const { tokenType } = room

    const { tokenAddress, stakingEnabled } = tokenData

    const polygonScanUrl = `https://polygonscan.com/token/${tokenAddress}`

    const urlText =
        tokenMetadata && 'name' in tokenMetadata && 'symbol' in tokenMetadata
            ? `${tokenMetadata.name} (${tokenMetadata.symbol})`
            : displayTokenAddress

    return (
        <div>
            This is a{stakingEnabled ? ' staking ' : ' token '}
            gated room, governed by the
            <a href={polygonScanUrl} target="_blank">
                {' '}
                <b>{urlText}</b>{' '}
            </a>
            {tokenType.standard} token
        </div>
    )
}

function Credits() {
    const { createdAt, createdBy } = useSelectedRoom() || {}

    const displayName = useDisplayUsername(createdBy, {
        fallback: i18n('common.unknownCreator'),
    })

    if (createdAt) {
        return (
            <>
                <span
                    css={[
                        !!createdBy &&
                            tw`
                                font-medium
                                break-all
                            `,
                    ]}
                >
                    {displayName}
                </span>{' '}
                {i18n('emptyMessageFeed.roomCreatedAt', createdAt)}
            </>
        )
    }

    if (createdBy) {
        return (
            <>
                {i18n(
                    'emptyMessageFeed.roomCreatedBy',
                    <span css={tw`font-medium`}>{trunc(createdBy)}</span>
                )}
            </>
        )
    }

    return null
}

function JoinButton() {
    const acceptInvite = useAcceptInvite()

    const accepting = useIsInviteBeingAccepted()

    return (
        <UtilityButton
            disabled={accepting}
            onClick={() => void acceptInvite()}
            css={tw`
                flex
                items-center
            `}
        >
            <Text>{i18n('common.join', accepting)}</Text>
            {accepting && (
                <div
                    css={tw`
                        relative
                        w-4
                        h-4
                        ml-3
                    `}
                >
                    <Spinner strokeColor="currentColor" />
                </div>
            )}
        </UtilityButton>
    )
}
