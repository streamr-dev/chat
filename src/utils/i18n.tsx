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
    'common.save': 'Save',
    'common.join'(ongoing = false) {
        return ongoing ? 'Joining…' : 'Join'
    },
    'common.addMember': 'Add member',
    'common.editMembers': 'Edit members',
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
    'common.fallbackRoomName': 'Unnamed room',
    'common.copied': 'Copied to clipboard',
    'common.copyRoomId': 'Copy room id',
    'common.copy': 'Copy',
    'common.ok': 'Ok',
    'common.hideRoom': 'Hide room',
    'common.unhideRoom': 'Unhide room',
    'common.unpin': 'Unpin',
    'common.roomProperties': 'Properties',
    'common.deleteRoom': 'Delete room',
    'common.member'(plural = false) {
        return plural ? 'members' : 'member'
    },
    'common.unknownCreator': 'Someone',
    'common.enable'(ongoing = false) {
        return ongoing ? 'Enabling…' : 'Enable'
    },
    'common.encryptedMessagePlaceholder': 'Message could not be decrypted',
    'common.retry'(ongoing = false) {
        return ongoing ? 'Retrying…' : 'Retry'
    },
    'common.loadingPreviousDay': 'Loading previous day…',
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
    'common.invitePending': 'Invite pending',
    'common.viewOnExplorer': 'View on explorer',
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
    'common.frontPageTitle': 'Streamr Chat dApp',
    'common.chatPageTitle': "Let's chat!",
    'common.addNewRoomLabel': 'Add new room',
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
    'common.connectWalletLabel': 'Connect a wallet',
    'common.decentralizedBy': 'Decentralized by',
    'common.inviteLabel': 'Invite',
    'common.requiringLabel': ' requiring ',
    'common.defaultSubmitLabel': 'Submit',
    'common.needWalletLabel': 'Need a wallet? Try ',
    'common.yesLabel': 'Yes',
    'common.noLabel': 'No',
    'aliasToast.failedToDestroy': 'Failed to remove a nickname',
    'aliasToast.failedToCreate': 'Failed to create a nickname',
    'aliasToast.failedToUpdate': 'Failed to update a nickname',
    'toasts.defaultTitle': 'Toast',
    'tokenIdToast.title': 'Token id required',
    'tokenIdToast.message'(tokenStandard: TokenStandard) {
        return (
            <>
                This room is gated by an {tokenStandard} token. Tell us your token ID to
                confirm&nbsp;ownership.
            </>
        )
    },
    'tokenIdToast.tokenIdInputPlaceholder': 'Type here…',
    'tokenIdToast.okLabel': 'Ok',
    'tokenIdToast.cancelLabel': 'Cancel',
    'delegationToast.title': 'Hot wallet required',
    'delegationToast.desc': 'In order to proceed the app will ask for your signature.',
    'delegationToast.okLabel'() {
        return i18n('common.ok')
    },
    'delegationToast.cancelLabel'() {
        return i18n('common.cancel')
    },
    'delegationToast.authorizingLabel': 'Authorizing your delegated wallet…',
    'delegationToast.successLabel': 'Access delegated successfully',
    'delegationToast.failureLabel': 'Failed to delegate access',
    'acceptInviteToast.joiningTitle': 'Setting new permissions…',
    'acceptInviteToast.successTitle': 'Joined successfully',
    'acceptInviteToast.failureTitle': 'Failed to join',
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
    'recoverToast.title': 'Failed',
    'recoverToast.desc': 'Would you like to try again?',
    'recoverToast.okLabel'() {
        return i18n('common.yesLabel')
    },
    'recoverToast.cancelLabel'() {
        return i18n('common.noLabel')
    },
    'confirmToast.title': 'Are you sure?',
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
    'app.name': 'thechat.app',
    'app.label': 'beta',
    'search.resultLabel': 'Search results',
    'search.waitLabel': 'Please wait…',
    'search.notFoundLabel': 'Not found',
    'search.noResultsLabel': 'No results',
    'search.searchFieldPlaceholder': 'Room id',
    'sidebar.findButtonLabel': 'Find',
    'sidebar.roomsLabel': 'Rooms',
    'messageInput.placeholder': 'Type a message…',
    'anonExplainer.title': 'Anonymous mode',
    'anonExplainer.desc':
        'Your randomly generated wallet address used for sending messages to others in this room:',
    'anonExplainer.addressLabel': 'Address',
    'anonExplainer.addressHint':
        "It'll change on refresh or when you switch to a different account.",
    'anonExplainer.privateKeyLabel': 'Private key',
    'anonExplainer.okLabel'() {
        return i18n('common.ok')
    },
    'modal.defaultTitle': 'Untitled dialog',
    'accountModal.title': 'Account',
    'accountModal.connectedWith'(integrationId: WalletIntegrationId) {
        return `Connected with ${i18n('common.integrationLabel', integrationId)}`
    },
    'accountModal.change': 'Change',
    'accountModal.copy'(copied = false) {
        return copied ? 'Copied' : 'Copy address'
    },
    'accountModal.showHiddenRoomsLabel': 'Show hidden rooms',
    'accountModal.retrieveOnLoginLabel': 'Retrieve hot wallet on login',
    'addMemberModal.title': 'Add member',
    'addMemberModal.memberFieldLabel': 'ENS name or 0x address',
    'addMemberModal.memberFieldPlaceholder': '0x…',
    'addMemberModal.addButtonLabel': 'Add',
    'addRoomModal.title': 'Add new room',
    'addRoomModal.nextButtonLabel': 'Next',
    'addRoomModal.createButtonLabel': 'Create',
    'addRoomModal.roomFieldPlaceholder': 'e.g. giggling-bear',
    'addRoomModal.roomFieldHint': 'The room name will be publicly visible.',
    'addRoomModal.privacyFieldLabel': 'Choose privacy',
    'addRoomModal.storageFieldLabel': 'Message storage',
    'addRoomModal.storageFieldHint':
        'When message storage is disabled, participants will only see messages sent while they are online.',
    'addTokenGatedRoomModal.title': 'Add new token gated room',
    'addTokenGatedRoomModal.addressFieldLabel': 'Token contract address from Polygon chain',
    'addTokenGatedRoomModal.minBalanceFieldLabel': 'Minimum balance needed to join the room',
    'addTokenGatedRoomModal.minBalanceFieldPlaceholder': 'e.g. 100',
    'addTokenGatedRoomModal.tokenIdsFieldLabel': 'Token IDs (comma separated)',
    'addTokenGatedRoomModal.stakingLabel': 'Enable Staking',
    'addTokenGatedRoomModal.stakingDesc':
        'When token staking is enabled, participants will need to deposit the minimum amount in order to join the room.',
    'addTokenGatedRoomModal.createButtonLabel': 'Create',
    'addTokenGatedRoomModal.changeButtonLabel': 'Change',
    'addTokenGatedRoomModal.searchFieldPlaceholder': 'Search or enter token address…',
    'addTokenGatedRoomModal.loadingTokens': 'Loading tokens…',
    'addTokenGatedRoomModal.noTokens': 'No tokens',
    'editMembersModal.title': 'Edit members',
    'editMembersModal.nicknameVisibilityNote': 'Nickname is only visible to you',
    'editMembersModal.currentAccountLabel': 'You',
    'editMembersModal.currentHotAccountLabel': 'Your delegated account',
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
    'editMembersModal.editNicknameLabel': 'Edit nickname',
    'editMembersModal.setNicknameLabel': 'Set nickname',
    'editMembersModal.deleteMemberLabel': 'Delete member',
    'howItWorksModal.title': 'How it works?',
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
    'infoModal.title': 'Info',
    'roomPropertiesModal.title': 'Room properties',
    'roomPropertiesModal.stakingLabel': 'Staking',
    'roomPropertiesModal.roomIdLabel': 'Room id',
    'roomPropertiesModal.dismissButtonLabel': 'Close',
    'walletModal.title': 'Select a wallet',
    'conversationHeader.roomNamePlaceholder': 'e.g. random-giggly-bear',
    'conversationHeader.renamingInProgress'(from: string, to: string) {
        return `Renaming "${from}" to "${to}"…`
    },
    'conversationHeader.renamingIdle': 'The room name will be publicly visible.',
    'conversationHeader.renameRoom': 'Rename room',
    'emptyMessageFeed.roomCreatedAt'(createdAt: number) {
        return `created this room on ${i18n('common.fullDate', createdAt)}`
    },
    'emptyMessageFeed.roomCreatedBy'(createdBy: ReactNode) {
        return <>Room created by {createdBy}.</>
    },
    'rooms.promoteHotWalletPrompt': 'Use your hot wallet to sign messages in this room.',
    'rooms.joinGatedPrompt': 'This is a token gated room. Join it to send messages.',
    'rooms.delegatePrompt'(actions: string[]) {
        return `Activate hot wallet signing to ${actions.join(' and ')} messages.`
    },
    'anonToast.title': 'Granting anons more rights…',
    'anonToast.failureTitle': 'Failed to give anons more rights',
    'anonToast.successTitle': 'Done',
    'anonToast.confirmTitle'() {
        return i18n('confirmToast.title')
    },
    'anonToast.confirmDesc': 'Anyone will be able to read and send messages in this room.',
    'anonToast.confirmOkLabel'() {
        return i18n('confirmToast.okLabel')
    },
    'anonToast.confirmCancelLabel'() {
        return i18n('confirmToast.cancelLabel')
    },
    'anonToast.cancelledTitle': 'Maybe another time!',
    'promoteToast.successTitle': 'Delegated account has been promoted',
    'promoteToast.failureTitle': 'Failed to promote the delegated account',
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
    'preferenceToast.updateFailureTitle': 'Failed to update preferences',
    'tokenGateToast.deployingTitle': 'Deploying token gate…',
    'tokenGateToast.waitingTitle': 'Waiting for the network…',
    'tokenGateToast.grantingTitle'(policyAddress: Address) {
        return `Assigning permissions to the token gate at ${policyAddress}…`
    },
    'tokenGateToast.successTitle': 'Done',
    'tokenGateToast.failureTitle': 'Failed to deploy your token gate',
    'tokenGatePolicyRecoverToast.title': 'Failed to deploy the policy',
    'tokenGatePolicyRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'tokenGatePolicyRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'tokenGatePolicyRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'tokenGateAddressRecoverToast.title': 'Failed to determine policy address',
    'tokenGateAddressRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'tokenGateAddressRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'tokenGateAddressRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'tokenGateGrantRecoverToast.title': 'Failed to assign new permissions',
    'tokenGateGrantRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'tokenGateGrantRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'tokenGateGrantRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'unpinToast.failureTitle': 'Unpinning failed',
    'storageToast.enabledTitle': 'Storage enabled',
    'storageToast.disabledTitle': 'Storage disabled',
    'storageToast.failedToEnableTitle': 'Failed to enable storage',
    'storageToast.failedToDisableTitle': 'Failed to disable storage',
    'roomVisibilityToast.failedToToggleTitle': 'Failed to toggle room visibility',
    'roomRenameToast.upToDateTitle': 'Room name is already up-to-date',
    'roomRenameToast.successTitle': 'Room renamed successfully',
    'roomRenameToast.failureTitle': 'Failed to rename the room',
    'gotInviteToast.title': "You've got an invite",
    'gotInviteToast.desc': 'Room list will reflect it shortly',
    'deleteRoomToast.successTitle': 'Room has been deleted',
    'deleteRoomToast.failureTitle': 'Failed to delete room',
    'roomCreateToast.unsupportedTokenTitle': 'Only ERC-20s & ERC-721s are supported',
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
    'publishRoomRecoverToast.desc':
        'Would you like to try again? If you click "No" the room will stay private.',
    'publishRoomRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'publishRoomRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'stickyPinToast.title'(count: number) {
        return `Pinned ${count} new sticky room${count === 1 ? '' : 's'}`
    },
    'stickyPinToast.okLabel': 'Dismiss',
    'joinTokenGatedRoomToast.notTokenGatedTitle': "It's not a token gated room",
    'joinTokenGatedRoomToast.joiningTitle'(name: string | undefined, roomId: RoomId) {
        return <>Joining {name ? `"${name}"` : <Id>{roomId}</Id>}…</>
    },
    'joinTokenGatedRoomToast.insufficientFundsTitle': 'Not enough tokens',
    'joinTokenGatedRoomToast.checkingPermissionsTitle': 'Checking permissions…',
    'joinTokenGatedRoomToast.successTitle': 'Joined!',
    'joinTokenGatedRoomToast.failureTitle': 'Failed to join',
    'joinTokenGatedRecoverToast.title': 'Transaction failed',
    'joinTokenGatedRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'joinTokenGatedRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'joinTokenGatedRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'checkTokenGatedPermissionsRecoverToast.title': 'Failed to detect new permissions',
    'checkTokenGatedPermissionsRecoverToast.desc'() {
        return i18n('recoverToast.desc')
    },
    'checkTokenGatedPermissionsRecoverToast.okLabel'() {
        return i18n('recoverToast.okLabel')
    },
    'checkTokenGatedPermissionsRecoverToast.cancelLabel'() {
        return i18n('recoverToast.cancelLabel')
    },
    'preselectToast.roomNotFoundTitle': 'Failed to find the room',
    'preselectToast.failedToUnhideTitle': 'Failed to unhide the room',
    'preselectToast.unauthorizedTitle': "You don't have access to the room",
    'preselectToast.failedtoOpenTitle': 'Failed to open the room',
    'preselectToast.openingTitle'(roomName: string | undefined, roomId: RoomId) {
        return <>Opening {roomName ? `"${roomName}"` : <Id>{roomId}</Id>}…</>
    },
    'preselectToast.pinningTitle'(roomName: string | undefined, roomId: RoomId) {
        return <>Pinning {roomName ? `"${roomName}"` : <Id>{roomId}</Id>}…</>
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

export default function i18n<K extends TKey>(k: K, ...args: Args<K>): TReturn<K> | string {
    let result: TReturn<K> | undefined

    try {
        const value: TValue<K> = I18n[k]

        if (typeof value === 'function') {
            result = (value as any)(...args)
        } else {
            result = I18n[k] as TReturn<K>
        }
    } catch (e) {
        // Do nothing
    }

    if (typeof result === 'undefined') {
        // Any failure resolves into showing the original key.
        return k
    }

    return result
}
