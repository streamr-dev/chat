import { TokenStandard } from '$/features/tokenGatedRooms/types'
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
    },
    tokenStandard: {
        [TokenStandard.ERC1155]() {
            return 'ERC-1155'
        },
        [TokenStandard.ERC20]() {
            return 'ERC-20'
        },
        [TokenStandard.ERC721]() {
            return 'ERC-721'
        },
        [TokenStandard.ERC777]() {
            return 'ERC-777'
        },
        [TokenStandard.Unknown]() {
            return 'Unknown'
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
    modal: {},
    accountModal: {
        title() {
            return 'Account'
        },
        connectedWith(integrationName: string) {
            return `Connected with ${integrationName}`
        },
        change() {
            return 'Change'
        },
        viewOnExplorer() {
            return 'View on explorer'
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
    editMembersModal: {},
    howItWorksModal: {},
    infoModal: {
        defaultTitle: 'Info',
    },
    roomPropertiesModal: {},
    walletModal: {},
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
