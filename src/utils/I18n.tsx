import Hodl from '$/components/Hodl'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { WalletIntegrationId } from '$/features/wallet/types'
import CoinbaseWalletIcon from '$/icons/CoinbaseWalletIcon'
import GatedIcon from '$/icons/GatedIcon'
import MetaMaskIcon from '$/icons/MetaMaskIcon'
import PrivateIcon from '$/icons/PrivateIcon'
import PublicIcon from '$/icons/PublicIcon'
import WalletConnectIcon from '$/icons/WalletConnectIcon'
import { PrivacySetting } from '$/types'
import { AccountType } from '$/utils/getAccountType'
import { format } from 'date-fns'
import { ReactNode } from 'react'

export const I18n = {
    common: {
        cancel() {
            return 'Cancel'
        },
        save() {
            return 'Save'
        },
        join(ongoing = false) {
            return ongoing ? 'Joining…' : 'Join'
        },
        addMember() {
            return 'Add member'
        },
        editMembers() {
            return 'Edit members'
        },
        fullDate(timestamp: number) {
            return format(timestamp, 'iiii, LLL do yyyy')
        },
        compactDate(timestamp: number) {
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
        fallbackRoomName() {
            return 'Unnamed room'
        },
        copied() {
            return 'Copied to clipboard'
        },
        copyRoomId() {
            return 'Copy room id'
        },
        copy() {
            return 'Copy'
        },
        ok() {
            return 'Ok'
        },
        hideRoom() {
            return 'Hide room'
        },
        unhideRoom() {
            return 'Unhide room'
        },
        unpin() {
            return 'Unpin'
        },
        roomProperties() {
            return 'Properties'
        },
        deleteRoom() {
            return 'Delete room'
        },
        member(plural = false) {
            return plural ? 'members' : 'member'
        },
        unknownCreator() {
            return 'Someone'
        },
        enable(ongoing = false) {
            return ongoing ? 'Enabling…' : 'Enable'
        },
        encryptedMessagePlaceholder() {
            return 'Message could not be decrypted'
        },
        retry(ongoing = false) {
            return ongoing ? 'Retrying…' : 'Retry'
        },
        loadingPreviousDay() {
            return 'Loading previous day…'
        },
        roomPrivacyLabel(privacySetting: PrivacySetting) {
            switch (privacySetting) {
                case PrivacySetting.Private:
                    return 'Private'
                case PrivacySetting.Public:
                    return 'Public'
                case PrivacySetting.TokenGated:
                    return 'Token gated'
            }
        },
        roomPrivacyIcon(privacySetting: PrivacySetting) {
            switch (privacySetting) {
                case PrivacySetting.Private:
                    return PrivateIcon
                case PrivacySetting.Public:
                    return PublicIcon
                case PrivacySetting.TokenGated:
                    return GatedIcon
            }
        },
        roomPrivacyDesc(privacySetting: PrivacySetting) {
            switch (privacySetting) {
                case PrivacySetting.Private:
                    return 'Only invited members can post and view messages'
                case PrivacySetting.Public:
                    return 'Anyone can view messages'
                case PrivacySetting.TokenGated:
                    return (
                        <>
                            Access granted only if you <Hodl /> a particular NFT
                            or&nbsp;ERC&#8209;20 token
                        </>
                    )
            }
        },
        tokenStandardLabel(tokenStandard: TokenStandard) {
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
        load(ongoing = false) {
            return ongoing ? 'Loading…' : 'Load'
        },
        invitePending() {
            return 'Invite pending'
        },
        viewOnExplorer() {
            return 'View on explorer'
        },
        integrationLabel(integrationId: WalletIntegrationId) {
            switch (integrationId) {
                case WalletIntegrationId.CoinbaseWallet:
                    return 'Coinbase Wallet'
                case WalletIntegrationId.MetaMask:
                    return 'MetaMask'
                case WalletIntegrationId.WalletConnect:
                    return 'WalletConnect'
            }
        },
        integrationIcon(integrationId: WalletIntegrationId) {
            switch (integrationId) {
                case WalletIntegrationId.CoinbaseWallet:
                    return CoinbaseWalletIcon
                case WalletIntegrationId.MetaMask:
                    return MetaMaskIcon
                case WalletIntegrationId.WalletConnect:
                    return WalletConnectIcon
            }
        },
        frontPageTitle() {
            return 'Streamr Chat dApp'
        },
        chatPageTitle() {
            return "Let's chat!"
        },
        addNewRoomLabel() {
            return 'Add new room'
        },
        holdLabel(flip = false) {
            return flip ? 'hodl' : 'hold'
        },
        greeting() {
            const h = new Date().getHours()

            if (h >= 3 && h <= 9 && Math.random() < 0.1) {
                // Betten 3am & 9am there's a tiny chance to get a gm.
                return 'gm'
            }

            return 'Hello world.'
        },
        connectWalletLabel() {
            return 'Connect a wallet'
        },
        decentralizedBy() {
            return 'Decentralized by'
        },
        inviteLabel() {
            return 'Invite'
        },
        requiringLabel() {
            return ' requiring '
        },
        defaultSubmitLabel() {
            return 'Submit'
        },
        needWalletLabel() {
            return 'Need a wallet? Try '
        },
        yesLabel() {
            return 'Yes'
        },
        noLabel() {
            return 'No'
        },
    },
    toasts: {
        defaultTitle() {
            return 'Toast'
        },
    },
    tokenIdToast: {
        title() {
            return 'Token id required'
        },
        message(tokenStandard: TokenStandard) {
            return (
                <>
                    This room is gated by an {tokenStandard} token. Tell us your token ID to
                    confirm&nbsp;ownership.
                </>
            )
        },
        tokenIdInputPlaceholder() {
            return 'Type here…'
        },
        okLabel() {
            return 'Ok'
        },
        cancelLabel() {
            return 'Cancel'
        },
    },
    delegationToast: {
        title() {
            return 'Hot wallet required'
        },
        desc() {
            return 'In order to proceed the app will ask for your signature.'
        },
        okLabel() {
            return I18n.common.ok()
        },
        cancelLabel() {
            return I18n.common.cancel()
        },
    },
    recoverToast: {
        title() {
            return 'Failed'
        },
        desc() {
            return 'Would you like to try again?'
        },
        okLabel() {
            return I18n.common.yesLabel()
        },
        cancelLabel() {
            return I18n.common.noLabel()
        },
    },
    appName() {
        return 'thechat.app'
    },
    appLabel() {
        return 'beta'
    },
    search: {
        resultLabel() {
            return 'Search results'
        },
        waitLabel() {
            return 'Please wait…'
        },
        notFoundLabel() {
            return 'Not found'
        },
        noResultsLabel() {
            return 'No results'
        },
        searchFieldPlaceholder() {
            return 'Room id'
        },
    },
    sidebar: {
        findButtonLabel() {
            return 'Find'
        },
        roomsLabel() {
            return 'Rooms'
        },
    },
    messageInput: {
        placeholder() {
            return 'Type a message…'
        },
    },
    anonExplainer: {
        title() {
            return 'Anonymous mode'
        },
        desc() {
            return 'Your randomly generated wallet address used for sending messages to others in this room:'
        },
        addressLabel() {
            return 'Address'
        },
        addressHint() {
            return "It'll change on refresh or when you switch to a different account."
        },
        privateKeyLabel() {
            return 'Private key'
        },
        okLabel() {
            return I18n.common.ok()
        },
    },
    modal: {
        defaultTitle() {
            return 'Untitled dialog'
        },
    },
    accountModal: {
        title() {
            return 'Account'
        },
        connectedWith(integrationId: WalletIntegrationId) {
            return `Connected with ${I18n.common.integrationLabel(integrationId)}`
        },
        change() {
            return 'Change'
        },
        copy(copied = false) {
            return copied ? 'Copied' : 'Copy address'
        },
        showHiddenRoomsLabel() {
            return 'Show hidden rooms'
        },
        retrieveOnLoginLabel() {
            return 'Retrieve hot wallet on login'
        },
    },
    addMemberModal: {
        title() {
            return 'Add member'
        },
        memberFieldLabel() {
            return 'ENS name or 0x address'
        },
        memberFieldPlaceholder() {
            return '0x…'
        },
        addButtonLabel() {
            return 'Add'
        },
    },
    addRoomModal: {
        title() {
            return 'Add new room'
        },
        nextButtonLabel() {
            return 'Next'
        },
        createButtonLabel() {
            return 'Create'
        },
        roomFieldPlaceholder() {
            return 'e.g. giggling-bear'
        },
        roomFieldHint() {
            return 'The room name will be publicly visible.'
        },
        privacyFieldLabel() {
            return 'Choose privacy'
        },
        storageFieldLabel() {
            return 'Message storage'
        },
        storageFieldHint() {
            return 'When message storage is disabled, participants will only see messages sent while they are online.'
        },
    },
    addTokenGatedRoomModal: {
        title() {
            return 'Add new token gated room'
        },
        addressFieldLabel() {
            return 'Token contract address from Polygon chain'
        },
        minBalanceFieldLabel() {
            return 'Minimum balance needed to join the room'
        },
        minBalanceFieldPlaceholder() {
            return 'e.g. 100'
        },
        tokenIdsFieldLabel() {
            return 'Token IDs (comma separated)'
        },
        stakingLabel() {
            return 'Enable Staking'
        },
        stakingDesc() {
            return 'When token staking is enabled, participants will need to deposit the minimum amount in order to join the room.'
        },
        createButtonLabel() {
            return 'Create'
        },
        changeButtonLabel() {
            return 'Change'
        },
        searchFieldPlaceholder() {
            return 'Search or enter token address…'
        },
        loadingTokens() {
            return 'Loading tokens…'
        },
        noTokens() {
            return 'No tokens'
        },
    },
    editMembersModal: {
        title() {
            return 'Edit members'
        },
        nicknameVisibilityNote() {
            return 'Nickname is only visible to you'
        },
        currentAccountLabel() {
            return 'You'
        },
        currentHotAccountLabel() {
            return 'Your delegated account'
        },
        accountType(accountType: AccountType) {
            switch (accountType) {
                case AccountType.Main:
                    return '[Main account] Room member'
                case AccountType.Unset:
                    return '[Unset account] Room member'
                default:
                    return null
            }
        },
        editNicknameLabel() {
            return 'Edit nickname'
        },
        setNicknameLabel() {
            return 'Set nickname'
        },
        deleteMemberLabel() {
            return 'Delete member'
        },
    },
    howItWorksModal: {
        title() {
            return 'How it works?'
        },
        content() {
            return (
                <>
                    <p>
                        Every chatroom is a stream on the Streamr Network and the chat room
                        participants are registered on the on-chain stream registry. The fabric
                        underpinning every chat room is a peer-to-peer WebRTC mesh network composed
                        of the participants of the chat&nbsp;room.
                    </p>
                    <p>
                        Streams, and chat rooms come in two main flavors - public and private.
                        Public meaning publicly readable, whereas private is
                        end-to-end&nbsp;encrypted.
                    </p>
                    <p>
                        If you wish to make a private group to chat with your friends, or with a
                        community - you can now do so without any intermediary and with full
                        confidence you are chatting with exactly who you think you're
                        chatting&nbsp;with!
                    </p>
                </>
            )
        },
    },
    infoModal: {
        title() {
            return 'Info'
        },
    },
    roomPropertiesModal: {
        title() {
            return 'Room properties'
        },
        stakingLabel() {
            return 'Staking'
        },
        roomIdLabel() {
            return 'Room id'
        },
        dismissButtonLabel() {
            return 'Close'
        },
    },
    walletModal: {
        title() {
            return 'Select a wallet'
        },
    },
    conversationHeader: {
        roomNamePlaceholder() {
            return 'e.g. random-giggly-bear'
        },
        renamingInProgress(from: string, to: string) {
            return `Renaming "${from}" to "${to}"…`
        },
        renamingIdle() {
            return 'The room name will be publicly visible.'
        },
        renameRoom() {
            return 'Rename room'
        },
    },
    emptyMessageFeed: {
        roomCreatedAt(createdAt: number) {
            return `created this room on ${I18n.common.fullDate(createdAt)}`
        },
        roomCreatedBy(createdBy: ReactNode) {
            return <>Room created by {createdBy}.</>
        },
    },
    rooms: {
        promoteHotWalletPrompt() {
            return 'Use your hot wallet to sign messages in this room.'
        },
        joinGatedPrompt() {
            return 'This is a token gated room. Join it to send messages.'
        },
        delegatePrompt(actions: string[]) {
            return `Activate hot wallet signing to ${actions.join(' and ')} messages.`
        },
    },
}
