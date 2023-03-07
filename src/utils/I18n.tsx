import Hodl from '$/components/Hodl'
import Id from '$/components/Id'
import { RoomId } from '$/features/room/types'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { WalletIntegrationId } from '$/features/wallet/types'
import CoinbaseWalletIcon from '$/icons/CoinbaseWalletIcon'
import GatedIcon from '$/icons/GatedIcon'
import MetaMaskIcon from '$/icons/MetaMaskIcon'
import PrivateIcon from '$/icons/PrivateIcon'
import PublicIcon from '$/icons/PublicIcon'
import WalletConnectIcon from '$/icons/WalletConnectIcon'
import { Address, PrivacySetting } from '$/types'
import { AccountType } from '$/utils/getAccountType'
import trunc from '$/utils/trunc'
import { format } from 'date-fns'
import { ReactNode } from 'react'

const I18n = {
    'common.cancel': 'Cancel',
    'common.save'() {
        return 'Save'
    },
    'common.join'(ongoing = false) {
        return ongoing ? 'Joining…' : 'Join'
    },
    'common.addMember'() {
        return 'Add member'
    },
    'common.editMembers'() {
        return 'Edit members'
    },
    'common.fullDate'(timestamp: number) {
        return format(timestamp, 'iiii, LLL do yyyy')
    },
    'common.compactDate'(timestamp: number) {
        const d = new Date(timestamp)

        const [Y, M, D, h, m, s] = [
            d.getFullYear(),
            d.getMonth() + 1,
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
            d.getSeconds(),
        ].map((val: number) => `${val < 10 ? '0' : ''}${val}`)

        return `${Y}/${M}/${D} ${h}:${m}:${s}`
    },
    'common.fallbackRoomName'() {
        return 'Unnamed room'
    },
    'common.copied'() {
        return 'Copied to clipboard'
    },
    'common.copyRoomId'() {
        return 'Copy room id'
    },
    'common.copy'() {
        return 'Copy'
    },
    'common.ok'() {
        return 'Ok'
    },
    'common.hideRoom'() {
        return 'Hide room'
    },
    'common.unhideRoom'() {
        return 'Unhide room'
    },
    'common.unpin'() {
        return 'Unpin'
    },
    'common.roomProperties'() {
        return 'Properties'
    },
    'common.deleteRoom'() {
        return 'Delete room'
    },
    'common.member'(plural = false) {
        return plural ? 'members' : 'member'
    },
    'common.unknownCreator'() {
        return 'Someone'
    },
    'common.enable'(ongoing = false) {
        return ongoing ? 'Enabling…' : 'Enable'
    },
    'common.encryptedMessagePlaceholder'() {
        return 'Message could not be decrypted'
    },
    'common.retry'(ongoing = false) {
        return ongoing ? 'Retrying…' : 'Retry'
    },
    'common.loadingPreviousDay'() {
        return 'Loading previous day…'
    },
    'common.roomPrivacyLabel'(privacySetting: PrivacySetting) {
        switch (privacySetting) {
            case PrivacySetting.Private:
                return 'Private'
            case PrivacySetting.Public:
                return 'Public'
            case PrivacySetting.TokenGated:
                return 'Token gated'
        }
    },
    'common.roomPrivacyIcon'(privacySetting: PrivacySetting) {
        switch (privacySetting) {
            case PrivacySetting.Private:
                return PrivateIcon
            case PrivacySetting.Public:
                return PublicIcon
            case PrivacySetting.TokenGated:
                return GatedIcon
        }
    },
    'common.roomPrivacyDesc'(privacySetting: PrivacySetting) {
        switch (privacySetting) {
            case PrivacySetting.Private:
                return 'Only invited members can post and view messages'
            case PrivacySetting.Public:
                return 'Anyone can view messages'
            case PrivacySetting.TokenGated:
                return (
                    <>
                        Access granted only if you <Hodl /> a particular NFT or&nbsp;ERC&#8209;20
                        token
                    </>
                )
        }
    },
    'common.tokenStandardLabel'(tokenStandard: TokenStandard) {
        switch (tokenStandard) {
            case TokenStandard.ERC1155:
            case TokenStandard.ERC20:
            case TokenStandard.ERC721:
            case TokenStandard.ERC777:
                return <>ERC&#8209;{tokenStandard.replace(/ERC/, '')}</>
            case TokenStandard.Unknown:
                return 'Unknown'
        }
    },
    'common.load'(ongoing = false) {
        return ongoing ? 'Loading…' : 'Load'
    },
    'common.invitePending'() {
        return 'Invite pending'
    },
    'common.viewOnExplorer'() {
        return 'View on explorer'
    },
    'common.integrationLabel'(integrationId: WalletIntegrationId) {
        switch (integrationId) {
            case WalletIntegrationId.CoinbaseWallet:
                return 'Coinbase Wallet'
            case WalletIntegrationId.MetaMask:
                return 'MetaMask'
            case WalletIntegrationId.WalletConnect:
                return 'WalletConnect'
        }
    },
    'common.integrationIcon'(integrationId: WalletIntegrationId) {
        switch (integrationId) {
            case WalletIntegrationId.CoinbaseWallet:
                return CoinbaseWalletIcon
            case WalletIntegrationId.MetaMask:
                return MetaMaskIcon
            case WalletIntegrationId.WalletConnect:
                return WalletConnectIcon
        }
    },
    'common.frontPageTitle'() {
        return 'Streamr Chat dApp'
    },
    'common.chatPageTitle'() {
        return "Let's chat!"
    },
    'common.addNewRoomLabel'() {
        return 'Add new room'
    },
    'common.holdLabel'(flip = false) {
        return flip ? 'hodl' : 'hold'
    },
    'common.greeting'() {
        const h = new Date().getHours()

        if (h >= 3 && h <= 9 && Math.random() < 0.1) {
            // Betten 3am & 9am there's a tiny chance to get a gm.
            return 'gm'
        }

        return 'Hello world.'
    },
    'common.connectWalletLabel'() {
        return 'Connect a wallet'
    },
    'common.decentralizedBy'() {
        return 'Decentralized by'
    },
    'common.inviteLabel'() {
        return 'Invite'
    },
    'common.requiringLabel'() {
        return ' requiring '
    },
    'common.defaultSubmitLabel'() {
        return 'Submit'
    },
    'common.needWalletLabel'() {
        return 'Need a wallet? Try '
    },
    'common.yesLabel'() {
        return 'Yes'
    },
    'common.noLabel'() {
        return 'No'
    },
    'aliasToast.failedToDestroy'() {
        return 'Failed to remove a nickname'
    },
    'aliasToast.failedToCreate'() {
        return 'Failed to create a nickname'
    },
    'aliasToast.failedToUpdate'() {
        return 'Failed to update a nickname'
    },
    'toasts.defaultTitle'() {
        return 'Toast'
    },
    'tokenIdToast.title'() {
        return 'Token id required'
    },
    'tokenIdToast.message'(tokenStandard: TokenStandard) {
        return (
            <>
                This room is gated by an {tokenStandard} token. Tell us your token ID to
                confirm&nbsp;ownership.
            </>
        )
    },
    'tokenIdToast.tokenIdInputPlaceholder'() {
        return 'Type here…'
    },
    'tokenIdToast.okLabel'() {
        return 'Ok'
    },
    'tokenIdToast.cancelLabel'() {
        return 'Cancel'
    },
    'delegationToast.title'() {
        return 'Hot wallet required'
    },
    'delegationToast.desc'() {
        return 'In order to proceed the app will ask for your signature.'
    },
    'delegationToast.okLabel'() {
        return i18n('common.ok')
    },
    'delegationToast.cancelLabel'() {
        return i18n('common.cancel')
    },
    'delegationToast.authorizingLabel'() {
        return 'Authorizing your delegated wallet…'
    },
    'delegationToast.successLabel'() {
        return 'Access delegated successfully'
    },
    'delegationToast.failureLabel'() {
        return 'Failed to delegate access'
    },
    'acceptInviteToast.joiningTitle'() {
        return 'Setting new permissions…'
    },
    'acceptInviteToast.successTitle'() {
        return 'Joined successfully'
    },
    'acceptInviteToast.failureTitle'() {
        return 'Failed to join'
    },
    'memberToast.addingTitle'(address: Address) {
        return (
            <>
                Adding <strong>{trunc(address)}</strong>…
            </>
        )
    },
    'memberToast.successTitle'(address: Address) {
        return (
            <>
                <strong>{trunc(address)}</strong> has been added
            </>
        )
    },
    'memberToast.alreadyMemberTitle'(address: Address) {
        return (
            <>
                <strong>{trunc(address)}</strong> is already a member
            </>
        )
    },
    'memberToast.failureTitle'(address: Address) {
        return (
            <>
                Failed to add <strong>{trunc(address)}</strong>
            </>
        )
    },
    'recoverToast.title'() {
        return 'Failed'
    },
    'recoverToast.desc'() {
        return 'Would you like to try again?'
    },
    'recoverToast.okLabel'() {
        return i18n('common.yesLabel')
    },
    'recoverToast.cancelLabel'() {
        return i18n('common.noLabel')
    },
    'confirmToast.title'() {
        return 'Are you sure?'
    },
    'confirmToast.okLabel'() {
        return i18n('common.yesLabel')
    },
    'confirmToast.cancelLabel'() {
        return i18n('common.cancel')
    },
    'isAuthorizedDelegationRecoverToast.title'() {
        return i18n('recoverToast.title')
    },
    'isAuthorizedDelegationRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'isAuthorizedDelegationRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'isAuthorizedDelegationRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    appName() {
        return 'thechat.app'
    },
    appLabel() {
        return 'beta'
    },
    'search.resultLabel'() {
        return 'Search results'
    },
    'search.waitLabel'() {
        return 'Please wait…'
    },
    'search.notFoundLabel'() {
        return 'Not found'
    },
    'search.noResultsLabel'() {
        return 'No results'
    },
    'search.searchFieldPlaceholder'() {
        return 'Room id'
    },
    'sidebar.findButtonLabel'() {
        return 'Find'
    },
    'sidebar.roomsLabel'() {
        return 'Rooms'
    },
    'messageInput.placeholder'() {
        return 'Type a message…'
    },
    'anonExplainer.title'() {
        return 'Anonymous mode'
    },
    'anonExplainer.desc'() {
        return 'Your randomly generated wallet address used for sending messages to others in this room:'
    },
    'anonExplainer.addressLabel'() {
        return 'Address'
    },
    'anonExplainer.addressHint'() {
        return "It'll change on refresh or when you switch to a different account."
    },
    'anonExplainer.privateKeyLabel'() {
        return 'Private key'
    },
    'anonExplainer.okLabel'() {
        return i18n('common.ok')
    },
    'modal.defaultTitle'() {
        return 'Untitled dialog'
    },
    'accountModal.title'() {
        return 'Account'
    },
    'accountModal.connectedWith'(integrationId: WalletIntegrationId) {
        return `Connected with ${i18n('common.integrationLabel', integrationId)}`
    },
    'accountModal.change'() {
        return 'Change'
    },
    'accountModal.copy'(copied = false) {
        return copied ? 'Copied' : 'Copy address'
    },
    'accountModal.showHiddenRoomsLabel'() {
        return 'Show hidden rooms'
    },
    'accountModal.retrieveOnLoginLabel'() {
        return 'Retrieve hot wallet on login'
    },
    'addMemberModal.title'() {
        return 'Add member'
    },
    'addMemberModal.memberFieldLabel'() {
        return 'ENS name or 0x address'
    },
    'addMemberModal.memberFieldPlaceholder'() {
        return '0x…'
    },
    'addMemberModal.addButtonLabel'() {
        return 'Add'
    },
    'addRoomModal.title'() {
        return 'Add new room'
    },
    'addRoomModal.nextButtonLabel'() {
        return 'Next'
    },
    'addRoomModal.createButtonLabel'() {
        return 'Create'
    },
    'addRoomModal.roomFieldPlaceholder'() {
        return 'e.g. giggling-bear'
    },
    'addRoomModal.roomFieldHint'() {
        return 'The room name will be publicly visible.'
    },
    'addRoomModal.privacyFieldLabel'() {
        return 'Choose privacy'
    },
    'addRoomModal.storageFieldLabel'() {
        return 'Message storage'
    },
    'addRoomModal.storageFieldHint'() {
        return 'When message storage is disabled, participants will only see messages sent while they are online.'
    },
    'addTokenGatedRoomModal.title'() {
        return 'Add new token gated room'
    },
    'addTokenGatedRoomModal.addressFieldLabel'() {
        return 'Token contract address from Polygon chain'
    },
    'addTokenGatedRoomModal.minBalanceFieldLabel'() {
        return 'Minimum balance needed to join the room'
    },
    'addTokenGatedRoomModal.minBalanceFieldPlaceholder'() {
        return 'e.g. 100'
    },
    'addTokenGatedRoomModal.tokenIdsFieldLabel'() {
        return 'Token IDs (comma separated)'
    },
    'addTokenGatedRoomModal.stakingLabel'() {
        return 'Enable Staking'
    },
    'addTokenGatedRoomModal.stakingDesc'() {
        return 'When token staking is enabled, participants will need to deposit the minimum amount in order to join the room.'
    },
    'addTokenGatedRoomModal.createButtonLabel'() {
        return 'Create'
    },
    'addTokenGatedRoomModal.changeButtonLabel'() {
        return 'Change'
    },
    'addTokenGatedRoomModal.searchFieldPlaceholder'() {
        return 'Search or enter token address…'
    },
    'addTokenGatedRoomModal.loadingTokens'() {
        return 'Loading tokens…'
    },
    'addTokenGatedRoomModal.noTokens'() {
        return 'No tokens'
    },
    'editMembersModal.title'() {
        return 'Edit members'
    },
    'editMembersModal.nicknameVisibilityNote'() {
        return 'Nickname is only visible to you'
    },
    'editMembersModal.currentAccountLabel'() {
        return 'You'
    },
    'editMembersModal.currentHotAccountLabel'() {
        return 'Your delegated account'
    },
    'editMembersModal.accountType'(accountType: AccountType) {
        switch (accountType) {
            case AccountType.Main:
                return '[Main account] Room member'
            case AccountType.Unset:
                return '[Unset account] Room member'
            default:
                return null
        }
    },
    'editMembersModal.editNicknameLabel'() {
        return 'Edit nickname'
    },
    'editMembersModal.setNicknameLabel'() {
        return 'Set nickname'
    },
    'editMembersModal.deleteMemberLabel'() {
        return 'Delete member'
    },
    'howItWorksModal.title'() {
        return 'How it works?'
    },
    'howItWorksModal.content'() {
        return (
            <>
                <p>
                    Every chatroom is a stream on the Streamr Network and the chat room participants
                    are registered on the on-chain stream registry. The fabric underpinning every
                    chat room is a peer-to-peer WebRTC mesh network composed of the participants of
                    the chat&nbsp;room.
                </p>
                <p>
                    Streams, and chat rooms come in two main flavors - public and private. Public
                    meaning publicly readable, whereas private is end-to-end&nbsp;encrypted.
                </p>
                <p>
                    If you wish to make a private group to chat with your friends, or with a
                    community - you can now do so without any intermediary and with full confidence
                    you are chatting with exactly who you think you're chatting&nbsp;with!
                </p>
            </>
        )
    },
    'infoModal.title'() {
        return 'Info'
    },
    'roomPropertiesModal.title'() {
        return 'Room properties'
    },
    'roomPropertiesModal.stakingLabel'() {
        return 'Staking'
    },
    'roomPropertiesModal.roomIdLabel'() {
        return 'Room id'
    },
    'roomPropertiesModal.dismissButtonLabel'() {
        return 'Close'
    },
    'walletModal.title'() {
        return 'Select a wallet'
    },
    'conversationHeader.roomNamePlaceholder'() {
        return 'e.g. random-giggly-bear'
    },
    'conversationHeader.renamingInProgress'(from: string, to: string) {
        return `Renaming "${from}" to "${to}"…`
    },
    'conversationHeader.renamingIdle'() {
        return 'The room name will be publicly visible.'
    },
    'conversationHeader.renameRoom'() {
        return 'Rename room'
    },
    'emptyMessageFeed.roomCreatedAt'(createdAt: number) {
        return `created this room on ${i18n('common.fullDate', createdAt)}`
    },
    'emptyMessageFeed.roomCreatedBy'(createdBy: ReactNode) {
        return <>Room created by {createdBy}.</>
    },
    'rooms.promoteHotWalletPrompt'() {
        return 'Use your hot wallet to sign messages in this room.'
    },
    'rooms.joinGatedPrompt'() {
        return 'This is a token gated room. Join it to send messages.'
    },
    'rooms.delegatePrompt'(actions: string[]) {
        return `Activate hot wallet signing to ${actions.join(' and ')} messages.`
    },
    'anonToast.title'() {
        return 'Granting anons more rights…'
    },
    'anonToast.failureTitle'() {
        return 'Failed to give anons more rights'
    },
    'anonToast.successTitle'() {
        return 'Done'
    },
    'anonToast.confirmTitle'() {
        return i18n('confirmToast.title')
    },
    'anonToast.confirmDesc'() {
        return 'Anyone will be able to read and send messages in this room.'
    },
    'anonToast.confirmOkLabel'() {
        return i18n('confirmToast.okLabel')
    },
    'anonToast.confirmCancelLabel'() {
        return i18n('confirmToast.cancelLabel')
    },
    'anonToast.cancelledTitle'() {
        return 'Maybe another time!'
    },
    'promoteToast.successTitle'() {
        return 'Delegated account has been promoted'
    },
    'promoteToast.failureTitle'() {
        return 'Failed to promote the delegated account'
    },
    'removeMemberToast.successTitle'(name: string) {
        return (
            <>
                <strong>{name}</strong> has been removed
            </>
        )
    },
    'removeMemberToast.failureTitle'(name: string) {
        return (
            <>
                Failed to remove <strong>{name}</strong>
            </>
        )
    },
    'preferenceToast.updateFailureTitle'() {
        return 'Failed to update preferences'
    },
    'tokenGateToast.deployingTitle'() {
        return 'Deploying token gate…'
    },
    'tokenGateToast.waitingTitle'() {
        return 'Waiting for the network…'
    },
    'tokenGateToast.grantingTitle'(policyAddress: Address) {
        return `Assigning permissions to the token gate at ${policyAddress}…`
    },
    'tokenGateToast.successTitle'() {
        return 'Done'
    },
    'tokenGateToast.failureTitle'() {
        return 'Failed to deploy your token gate'
    },
    'tokenGatePolicyRecoverToast.title'() {
        return 'Failed to deploy the policy'
    },
    'tokenGatePolicyRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'tokenGatePolicyRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'tokenGatePolicyRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'tokenGateAddressRecoverToast.title'() {
        return 'Failed to determine policy address'
    },
    'tokenGateAddressRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'tokenGateAddressRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'tokenGateAddressRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'tokenGateGrantRecoverToast.title'() {
        return 'Failed to assign new permissions'
    },
    'tokenGateGrantRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'tokenGateGrantRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'tokenGateGrantRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'unpinToast.failureTitle'() {
        return 'Unpinning failed'
    },
    'storageToast.enabledTitle'() {
        return 'Storage enabled'
    },
    'storageToast.disabledTitle'() {
        return 'Storage disabled'
    },
    'storageToast.failedToEnableTitle'() {
        return 'Failed to enable storage'
    },
    'storageToast.failedToDisableTitle'() {
        return 'Failed to disable storage'
    },
    'roomVisibilityToast.failedToToggleTitle'() {
        return 'Failed to toggle room visibility'
    },
    'roomRenameToast.upToDateTitle'() {
        return 'Room name is already up-to-date'
    },
    'roomRenameToast.successTitle'() {
        return 'Room renamed successfully'
    },
    'roomRenameToast.failureTitle'() {
        return 'Failed to rename the room'
    },
    'gotInviteToast.title'() {
        return "You've got an invite"
    },
    'gotInviteToast.desc'() {
        return 'Room list will reflect it shortly'
    },
    'deleteRoomToast.successTitle'() {
        return 'Room has been deleted'
    },
    'deleteRoomToast.failureTitle'() {
        return 'Failed to delete room'
    },
    'roomCreateToast.unsupportedTokenTitle'() {
        return 'Only ERC-20s & ERC-721s are supported'
    },
    'roomCreateToast.creatingTitle'(roomName: string) {
        return `Creating "${roomName}"…`
    },
    'roomCreateToast.publishingTitle'(roomName: string) {
        return `Making "${roomName}" public…`
    },
    'roomCreateToast.successTitle'(roomName: string) {
        return `Room "${roomName}" created`
    },
    'roomCreateToast.failureTitle'(roomName: string) {
        return `Failed to create "${roomName}"`
    },
    'publishRoomRecoverToast.title'(roomName: string) {
        return `Failed to make "${roomName}" public`
    },
    'publishRoomRecoverToast.desc'() {
        return 'Would you like to try again? If you click "No" the room will stay private.'
    },
    'publishRoomRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'publishRoomRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'stickyPinToast.title'(count: number) {
        return `Pinned ${count} new sticky room${count === 1 ? '' : 's'}`
    },
    'stickyPinToast.okLabel'() {
        return 'Dismiss'
    },
    'joinTokenGatedRoomToast.notTokenGatedTitle'() {
        return "It's not a token gated room"
    },
    'joinTokenGatedRoomToast.joiningTitle'(name: string | undefined, roomId: RoomId) {
        return <>Joining {name ? `"${name}"` : <Id>{roomId}</Id>}…</>
    },
    'joinTokenGatedRoomToast.insufficientFundsTitle'() {
        return 'Not enough tokens'
    },
    'joinTokenGatedRoomToast.checkingPermissionsTitle'() {
        return 'Checking permissions…'
    },
    'joinTokenGatedRoomToast.successTitle'() {
        return 'Joined!'
    },
    'joinTokenGatedRoomToast.failureTitle'() {
        return 'Failed to join'
    },
    'joinTokenGatedRecoverToast.title'() {
        return 'Transaction failed'
    },
    'joinTokenGatedRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'joinTokenGatedRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'joinTokenGatedRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'checkTokenGatedPermissionsRecoverToast.title'() {
        return 'Failed to detect new permissions'
    },
    'checkTokenGatedPermissionsRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'checkTokenGatedPermissionsRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'checkTokenGatedPermissionsRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
}

type TKey = keyof typeof I18n

type TValue<K extends TKey> = (typeof I18n)[K]

type Args<K extends TKey> = TValue<K> extends string
    ? []
    : TValue<K> extends (...args: infer R) => any
    ? R
    : []

type TReturn<K extends TKey> = TValue<K> extends string
    ? string
    : TValue<K> extends (...args: any) => infer R
    ? R
    : never

export default function i18n<K extends keyof typeof I18n>(
    k: K,
    ...args: Args<K>
): TReturn<K> | string {
    try {
        const value: TValue<K> = I18n[k]

        if (typeof value === 'function') {
            return (value as any)(...args) as TReturn<K>
        }

        return I18n[k] as TReturn<K>
    } catch (e) {
        // Do nothing
    }

    // Any failure resolves into showing the original key.
    return k
}
